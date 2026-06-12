import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
  calculateStreak,
} from "../utils/helpers.js";
import prisma from "../lib/prisma.js";

/**
 * Helper to calculate session totals
 */
const calculateSessionTotals = (exercises) => {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;

  const processedExercises = exercises.map((exercise) => {
    let exerciseVolume = 0;
    exercise.sets.forEach((set) => {
      if (set.completed) {
        exerciseVolume += (set.reps || 0) * (set.weight || 0);
        totalSets += 1;
        totalReps += (set.reps || 0);
      }
    });
    return {
      ...exercise,
      totalVolume: exerciseVolume,
    };
  });

  totalVolume = processedExercises.reduce((sum, ex) => sum + ex.totalVolume, 0);

  return {
    processedExercises,
    totalVolume,
    totalSets,
    totalReps,
  };
};

/**
 * @desc    Get all workout sessions for user
 * @route   GET /api/sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
  const { page, limit, status, startDate, endDate } = req.query;

  const where = { userId: req.user.id };

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate);
    if (endDate) where.startTime.lte = new Date(endDate);
  }

  const result = await paginate(prisma.workoutSession, {
    where,
    include: {
      workout: true,
      exercises: {
        include: {
          sets: true,
        },
        orderBy: { order: 'asc' }
      },
    },
    orderBy: { startTime: 'desc' },
  }, {
    page,
    limit,
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single workout session
 * @route   GET /api/sessions/:id
 * @access  Private
 */
export const getSession = asyncHandler(async (req, res) => {
  const session = await prisma.workoutSession.findUnique({
    where: { id: req.params.id },
    include: {
      workout: true,
      exercises: {
        include: {
          sets: true,
        },
        orderBy: { order: 'asc' }
      },
    }
  });

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to access this session");
  }

  successResponse(res, 200, { session }, "Session retrieved");
});

/**
 * @desc    Start new workout session
 * @route   POST /api/sessions/start
 * @access  Private
 */
export const startSession = asyncHandler(async (req, res) => {
  const { workoutId, workoutName, exercises } = req.body;

  // If workoutId provided, get workout details
  let workout = null;
  if (workoutId) {
    workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: true }
    });
    if (!workout) {
      return errorResponse(res, 404, "Workout not found");
    }
  }

  const sessionExercisesData = exercises || workout?.exercises.map((ex, index) => ({
    exerciseId: ex.exerciseId,
    name: ex.name,
    order: index + 1,
    sets: Array.from({ length: ex.sets }, (_, i) => ({
      setNumber: i + 1,
      reps: ex.reps,
      weight: ex.weight,
      completed: false,
    })),
  })) || [];

  const session = await prisma.workoutSession.create({
    data: {
      userId: req.user.id,
      workoutId: workoutId || null,
      workoutName: workoutName || workout?.name || "Quick Workout",
      startTime: new Date(),
      status: "in_progress",
      exercises: {
        create: sessionExercisesData.map(ex => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          order: ex.order,
          sets: {
            create: ex.sets.map(s => ({
              setNumber: s.setNumber,
              reps: s.reps,
              weight: s.weight,
              completed: s.completed || false,
            }))
          }
        }))
      }
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      }
    }
  });

  successResponse(res, 201, { session }, "Workout session started");
});

/**
 * @desc    Update workout session
 * @route   PUT /api/sessions/:id
 * @access  Private
 */
export const updateSession = asyncHandler(async (req, res) => {
  let session = await prisma.workoutSession.findUnique({
    where: { id: req.params.id },
    include: { exercises: { include: { sets: true } } }
  });

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to update this session");
  }

  const { exercises, ...otherData } = req.body;

  if (exercises) {
    const { totalVolume, totalSets, totalReps } = calculateSessionTotals(exercises);

    session = await prisma.$transaction(async (tx) => {
      // Clean up existing nested relations to simplify update
      await tx.sessionSet.deleteMany({
        where: { exercise: { sessionId: req.params.id } }
      });
      await tx.sessionExercise.deleteMany({
        where: { sessionId: req.params.id }
      });

      return await tx.workoutSession.update({
        where: { id: req.params.id },
        data: {
          ...otherData,
          totalVolume,
          totalSets,
          totalReps,
          exercises: {
            create: exercises.map(ex => ({
              exerciseId: ex.exerciseId,
              name: ex.name,
              order: ex.order,
              totalVolume: ex.totalVolume || 0,
              sets: {
                create: ex.sets.map(s => ({
                  setNumber: s.setNumber,
                  reps: s.reps,
                  weight: s.weight,
                  completed: s.completed || false,
                }))
              }
            }))
          }
        },
        include: {
          exercises: {
            include: {
              sets: true
            }
          }
        }
      });
    });
  } else {
    session = await prisma.workoutSession.update({
      where: { id: req.params.id },
      data: otherData,
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });
  }

  successResponse(res, 200, { session }, "Session updated");
});

/**
 * @desc    Complete workout session
 * @route   POST /api/sessions/:id/complete
 * @access  Private
 */
export const completeSession = asyncHandler(async (req, res) => {
  let session = await prisma.workoutSession.findUnique({
    where: { id: req.params.id },
    include: { exercises: { include: { sets: true } } }
  });

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to complete this session");
  }

  const endTime = new Date();
  const startTime = new Date(session.startTime);
  const duration = Math.floor((endTime - startTime) / 1000);

  // Re-calculate totals just in case
  const { totalVolume, totalSets, totalReps } = calculateSessionTotals(session.exercises);

  // Update session
  session = await prisma.workoutSession.update({
    where: { id: req.params.id },
    data: {
      endTime,
      duration,
      status: "completed",
      rating: req.body.rating || null,
      notes: req.body.notes || session.notes,
      totalVolume,
      totalSets,
      totalReps,
    },
    include: { exercises: true }
  });

  // Update user stats
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  const updatedStats = { ...(typeof user.stats === 'string' ? JSON.parse(user.stats) : user.stats) };
  updatedStats.totalWorkouts += 1;
  updatedStats.totalWeightLifted += totalVolume;

  // Update streak
  const completedSessions = await prisma.workoutSession.findMany({
    where: {
      userId: req.user.id,
      status: "completed",
    },
    select: { startTime: true },
    orderBy: { startTime: 'desc' },
  });

  const workoutDates = completedSessions.map((s) => s.startTime);
  updatedStats.currentStreak = calculateStreak(workoutDates);

  if (updatedStats.currentStreak > updatedStats.longestStreak) {
    updatedStats.longestStreak = updatedStats.currentStreak;
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      stats: updatedStats,
      lastWorkoutDate: new Date(),
    }
  });

  // Update workout if it was based on a template
  if (session.workoutId) {
    await prisma.workout.update({
      where: { id: session.workoutId },
      data: {
        timesCompleted: { increment: 1 },
        lastPerformed: new Date(),
      }
    });
  }

  successResponse(res, 200, { session }, "Workout completed successfully");
});

/**
 * @desc    Cancel workout session
 * @route   POST /api/sessions/:id/cancel
 * @access  Private
 */
export const cancelSession = asyncHandler(async (req, res) => {
  const session = await prisma.workoutSession.findUnique({
    where: { id: req.params.id }
  });

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to cancel this session");
  }

  const updatedSession = await prisma.workoutSession.update({
    where: { id: req.params.id },
    data: {
      status: "cancelled",
      endTime: new Date(),
    }
  });

  successResponse(res, 200, { session: updatedSession }, "Workout session cancelled");
});

/**
 * @desc    Delete workout session
 * @route   DELETE /api/sessions/:id
 * @access  Private
 */
export const deleteSession = asyncHandler(async (req, res) => {
  const session = await prisma.workoutSession.findUnique({
    where: { id: req.params.id }
  });

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to delete this session");
  }

  await prisma.workoutSession.delete({
    where: { id: req.params.id }
  });

  successResponse(res, 200, {}, "Session deleted successfully");
});

/**
 * @desc    Get workout statistics
 * @route   GET /api/sessions/stats/summary
 * @access  Private
 */
export const getWorkoutStats = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();

  if (period === "week") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (period === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: req.user.id,
      status: "completed",
      startTime: { gte: startDate, lte: endDate },
    },
  });

  const stats = {
    totalWorkouts: sessions.length,
    totalVolume: sessions.reduce((sum, s) => sum + s.totalVolume, 0),
    totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
    averageDuration:
      sessions.length > 0
        ? Math.round(
          sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        )
        : 0,
    weeklyData: [],
  };

  successResponse(res, 200, { stats }, "Workout statistics retrieved");
});

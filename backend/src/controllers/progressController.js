import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import prisma from "../lib/prisma.js";

/**
 * @desc    Get all progress entries for user
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgressEntries = asyncHandler(async (req, res) => {
  const { page, limit, startDate, endDate } = req.query;

  const where = { userId: req.user.id };

  // Filter by date range
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const result = await paginate(prisma.progress, {
    where,
    orderBy: { date: 'desc' },
  }, {
    page,
    limit,
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single progress entry
 * @route   GET /api/progress/:id
 * @access  Private
 */
export const getProgressEntry = asyncHandler(async (req, res) => {
  const progress = await prisma.progress.findUnique({
    where: { id: req.params.id }
  });

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId !== req.user.id) {
    return errorResponse(
      res,
      403,
      "Not authorized to access this progress entry"
    );
  }

  successResponse(res, 200, { progress }, "Progress entry retrieved");
});

/**
 * @desc    Create progress entry
 * @route   POST /api/progress
 * @access  Private
 */
export const createProgressEntry = asyncHandler(async (req, res) => {
  const progress = await prisma.progress.create({
    data: {
      ...req.body,
      userId: req.user.id,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    },
  });

  successResponse(
    res,
    201,
    { progress },
    "Progress entry created successfully"
  );
});

/**
 * @desc    Update progress entry
 * @route   PUT /api/progress/:id
 * @access  Private
 */
export const updateProgressEntry = asyncHandler(async (req, res) => {
  let progress = await prisma.progress.findUnique({
    where: { id: req.params.id }
  });

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId !== req.user.id) {
    return errorResponse(
      res,
      403,
      "Not authorized to update this progress entry"
    );
  }

  const updateData = { ...req.body };
  if (updateData.date) updateData.date = new Date(updateData.date);

  progress = await prisma.progress.update({
    where: { id: req.params.id },
    data: updateData,
  });

  successResponse(
    res,
    200,
    { progress },
    "Progress entry updated successfully"
  );
});

/**
 * @desc    Delete progress entry
 * @route   DELETE /api/progress/:id
 * @access  Private
 */
export const deleteProgressEntry = asyncHandler(async (req, res) => {
  const progress = await prisma.progress.findUnique({
    where: { id: req.params.id }
  });

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId !== req.user.id) {
    return errorResponse(
      res,
      403,
      "Not authorized to delete this progress entry"
    );
  }

  await prisma.progress.delete({
    where: { id: req.params.id }
  });

  successResponse(res, 200, {}, "Progress entry deleted successfully");
});

/**
 * @desc    Get progress dashboard data
 * @route   GET /api/progress/dashboard
 * @access  Private
 */
export const getProgressDashboard = asyncHandler(async (req, res) => {
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
  } else if (period === "6weeks") {
    startDate.setDate(startDate.getDate() - 42);
  }

  // Get workout sessions for the period
  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: req.user.id,
      status: "completed",
      startTime: { gte: startDate, lte: endDate },
    },
    orderBy: { startTime: 'asc' },
  });

  // Get progress entries
  const progressEntries = await prisma.progress.findMany({
    where: {
      userId: req.user.id,
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  // Aggregate data by week
  const weeklyData = [];
  const weekMap = new Map();

  sessions.forEach((session) => {
    const weekStart = new Date(session.startTime);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        week: `Week ${weeklyData.length + 1}`,
        date: weekStart,
        workouts: 0,
        totalVolume: 0,
        totalDuration: 0,
      });
    }

    const weekData = weekMap.get(weekKey);
    weekData.workouts += 1;
    weekData.totalVolume += session.totalVolume;
    weekData.totalDuration += session.duration;
  });

  // Convert map to array and sort by date
  weeklyData.push(
    ...Array.from(weekMap.values()).sort((a, b) => a.date - b.date)
  );

  // Get exercise records manually since Prisma aggregate is complex with nested relations
  const allCompletedSessions = await prisma.workoutSession.findMany({
    where: {
      userId: req.user.id,
      status: "completed",
    },
    include: {
      exercises: {
        include: {
          sets: {
            where: { completed: true }
          }
        }
      }
    }
  });

  const exerciseMap = new Map();
  allCompletedSessions.forEach(session => {
    session.exercises.forEach(ex => {
      if (!exerciseMap.has(ex.exerciseId)) {
        exerciseMap.set(ex.exerciseId, {
          exerciseName: ex.name,
          maxWeight: 0,
          maxReps: 0,
          totalVolume: 0
        });
      }
      const stats = exerciseMap.get(ex.exerciseId);
      ex.sets.forEach(set => {
        if (set.weight > stats.maxWeight) stats.maxWeight = set.weight;
        if (set.reps > stats.maxReps) stats.maxReps = set.reps;
        stats.totalVolume += (set.weight * set.reps);
      });
    });
  });

  const exerciseStats = Array.from(exerciseMap.values())
    .sort((a, b) => b.maxWeight - a.maxWeight)
    .slice(0, 10);

  const dashboardData = {
    weeklyData,
    progressEntries,
    exerciseStats,
    summary: {
      totalWorkouts: sessions.length,
      totalVolume: sessions.reduce((sum, s) => sum + s.totalVolume, 0),
      averageDuration:
        sessions.length > 0
          ? Math.round(
            sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
          )
          : 0,
    },
  };

  successResponse(
    res,
    200,
    { dashboard: dashboardData },
    "Dashboard data retrieved"
  );
});

/**
 * @desc    Get body weight history
 * @route   GET /api/progress/weight-history
 * @access  Private
 */
export const getWeightHistory = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;

  const endDate = new Date();
  const startDate = new Date();

  if (period === "week") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (period === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const weightHistory = await prisma.progress.findMany({
    where: {
      userId: req.user.id,
      date: { gte: startDate, lte: endDate },
      bodyWeight: { not: null },
    },
    select: {
      date: true,
      bodyWeight: true,
      bodyFat: true,
      muscleMass: true,
    },
    orderBy: { date: 'asc' },
  });

  successResponse(res, 200, { weightHistory }, "Weight history retrieved");
});

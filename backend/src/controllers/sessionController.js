import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
  calculateStreak,
} from "../utils/helpers.js";
import WorkoutSession from "../models/WorkoutSession.js";
import Workout from "../models/Workout.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";

/**
 * @desc    Get all workout sessions for user
 * @route   GET /api/sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
  const { page, limit, status, startDate, endDate } = req.query;

  const query = { userId: req.user._id };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }

  const result = await paginate(WorkoutSession, query, {
    page,
    limit,
    sort: "-startTime",
    populate: "workoutId exercises.exerciseId",
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single workout session
 * @route   GET /api/sessions/:id
 * @access  Private
 */
export const getSession = asyncHandler(async (req, res) => {
  const session = await WorkoutSession.findById(req.params.id)
    .populate("workoutId")
    .populate("exercises.exerciseId");

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId.toString() !== req.user._id.toString()) {
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
    workout = await Workout.findById(workoutId);
    if (!workout) {
      return errorResponse(res, 404, "Workout not found");
    }
  }

  const sessionData = {
    userId: req.user._id,
    workoutId: workoutId || null,
    workoutName: workoutName || workout?.name || "Quick Workout",
    exercises:
      exercises ||
      workout?.exercises.map((ex, index) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: Array.from({ length: ex.sets }, (_, i) => ({
          setNumber: i + 1,
          reps: ex.reps,
          weight: ex.weight,
          completed: false,
        })),
        order: index + 1,
      })) ||
      [],
    startTime: new Date(),
    status: "in-progress",
  };

  const session = await WorkoutSession.create(sessionData);

  successResponse(res, 201, { session }, "Workout session started");
});

/**
 * @desc    Update workout session
 * @route   PUT /api/sessions/:id
 * @access  Private
 */
export const updateSession = asyncHandler(async (req, res) => {
  let session = await WorkoutSession.findById(req.params.id);

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to update this session");
  }

  session = await WorkoutSession.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  successResponse(res, 200, { session }, "Session updated");
});

/**
 * @desc    Complete workout session
 * @route   POST /api/sessions/:id/complete
 * @access  Private
 */
export const completeSession = asyncHandler(async (req, res) => {
  const session = await WorkoutSession.findById(req.params.id);

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to complete this session");
  }

  // Update session
  session.endTime = new Date();
  session.status = "completed";
  session.rating = req.body.rating || null;
  session.notes = req.body.notes || session.notes;

  await session.save();

  // Update user stats
  const user = await User.findById(req.user._id);
  user.stats.totalWorkouts += 1;
  user.stats.totalWeightLifted += session.totalVolume;
  user.lastWorkoutDate = new Date();

  // Update streak
  const completedSessions = await WorkoutSession.find({
    userId: req.user._id,
    status: "completed",
  })
    .select("startTime")
    .sort("-startTime");

  const workoutDates = completedSessions.map((s) => s.startTime);
  user.stats.currentStreak = calculateStreak(workoutDates);

  if (user.stats.currentStreak > user.stats.longestStreak) {
    user.stats.longestStreak = user.stats.currentStreak;
  }

  await user.save();

  // Update workout if it was based on a template
  if (session.workoutId) {
    await Workout.findByIdAndUpdate(session.workoutId, {
      $inc: { timesCompleted: 1 },
      lastPerformed: new Date(),
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
  const session = await WorkoutSession.findById(req.params.id);

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to cancel this session");
  }

  session.status = "cancelled";
  session.endTime = new Date();
  await session.save();

  successResponse(res, 200, { session }, "Workout session cancelled");
});

/**
 * @desc    Delete workout session
 * @route   DELETE /api/sessions/:id
 * @access  Private
 */
export const deleteSession = asyncHandler(async (req, res) => {
  const session = await WorkoutSession.findById(req.params.id);

  if (!session) {
    return errorResponse(res, 404, "Workout session not found");
  }

  // Check ownership
  if (session.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to delete this session");
  }

  await session.deleteOne();

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

  const sessions = await WorkoutSession.find({
    userId: req.user._id,
    status: "completed",
    startTime: { $gte: startDate, $lte: endDate },
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

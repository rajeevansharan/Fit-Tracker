import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import Progress from "../models/Progress.js";
import WorkoutSession from "../models/WorkoutSession.js";

/**
 * @desc    Get all progress entries for user
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgressEntries = asyncHandler(async (req, res) => {
  const { page, limit, startDate, endDate } = req.query;

  const query = { userId: req.user._id };

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const result = await paginate(Progress, query, {
    page,
    limit,
    sort: "-date",
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single progress entry
 * @route   GET /api/progress/:id
 * @access  Private
 */
export const getProgressEntry = asyncHandler(async (req, res) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId.toString() !== req.user._id.toString()) {
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
  const progressData = {
    ...req.body,
    userId: req.user._id,
  };

  const progress = await Progress.create(progressData);

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
  let progress = await Progress.findById(req.params.id);

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId.toString() !== req.user._id.toString()) {
    return errorResponse(
      res,
      403,
      "Not authorized to update this progress entry"
    );
  }

  progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return errorResponse(res, 404, "Progress entry not found");
  }

  // Check ownership
  if (progress.userId.toString() !== req.user._id.toString()) {
    return errorResponse(
      res,
      403,
      "Not authorized to delete this progress entry"
    );
  }

  await progress.deleteOne();

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
  const sessions = await WorkoutSession.find({
    userId: req.user._id,
    status: "completed",
    startTime: { $gte: startDate, $lte: endDate },
  }).sort("startTime");

  // Get progress entries
  const progressEntries = await Progress.find({
    userId: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  }).sort("date");

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

  // Get exercise records
  const exerciseStats = await WorkoutSession.aggregate([
    {
      $match: {
        userId: req.user._id,
        status: "completed",
      },
    },
    {
      $unwind: "$exercises",
    },
    {
      $unwind: "$exercises.sets",
    },
    {
      $match: {
        "exercises.sets.completed": true,
      },
    },
    {
      $group: {
        _id: "$exercises.exerciseId",
        exerciseName: { $first: "$exercises.name" },
        maxWeight: { $max: "$exercises.sets.weight" },
        maxReps: { $max: "$exercises.sets.reps" },
        totalVolume: {
          $sum: {
            $multiply: ["$exercises.sets.weight", "$exercises.sets.reps"],
          },
        },
      },
    },
    {
      $sort: { maxWeight: -1 },
    },
    {
      $limit: 10,
    },
  ]);

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

  const weightHistory = await Progress.find({
    userId: req.user._id,
    date: { $gte: startDate, $lte: endDate },
    bodyWeight: { $ne: null },
  })
    .select("date bodyWeight bodyFat muscleMass")
    .sort("date");

  successResponse(res, 200, { weightHistory }, "Weight history retrieved");
});

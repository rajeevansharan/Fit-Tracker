import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import Workout from "../models/Workout.js";

/**
 * @desc    Get all workouts for logged in user
 * @route   GET /api/workouts
 * @access  Private
 */
export const getWorkouts = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = req.query;

  const query = { userId: req.user._id };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  const result = await paginate(Workout, query, {
    page,
    limit,
    sort: "-createdAt",
    populate: "exercises.exerciseId",
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single workout
 * @route   GET /api/workouts/:id
 * @access  Private
 */
export const getWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id).populate(
    "exercises.exerciseId"
  );

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check if user owns the workout
  if (
    workout.userId.toString() !== req.user._id.toString() &&
    !workout.isPublic
  ) {
    return errorResponse(res, 403, "Not authorized to access this workout");
  }

  successResponse(res, 200, { workout }, "Workout retrieved");
});

/**
 * @desc    Create new workout
 * @route   POST /api/workouts
 * @access  Private
 */
export const createWorkout = asyncHandler(async (req, res) => {
  const workoutData = {
    ...req.body,
    userId: req.user._id,
  };

  const workout = await Workout.create(workoutData);

  successResponse(res, 201, { workout }, "Workout created successfully");
});

/**
 * @desc    Update workout
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
export const updateWorkout = asyncHandler(async (req, res) => {
  let workout = await Workout.findById(req.params.id);

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to update this workout");
  }

  workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  successResponse(res, 200, { workout }, "Workout updated successfully");
});

/**
 * @desc    Delete workout
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to delete this workout");
  }

  await workout.deleteOne();

  successResponse(res, 200, {}, "Workout deleted successfully");
});

/**
 * @desc    Add exercise to workout
 * @route   POST /api/workouts/:id/exercises
 * @access  Private
 */
export const addExerciseToWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to modify this workout");
  }

  // Add exercise
  const exercise = {
    ...req.body,
    order: workout.exercises.length + 1,
  };

  workout.exercises.push(exercise);
  await workout.save();

  successResponse(res, 200, { workout }, "Exercise added to workout");
});

/**
 * @desc    Remove exercise from workout
 * @route   DELETE /api/workouts/:id/exercises/:exerciseId
 * @access  Private
 */
export const removeExerciseFromWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, "Not authorized to modify this workout");
  }

  // Remove exercise
  workout.exercises = workout.exercises.filter(
    (ex) => ex._id.toString() !== req.params.exerciseId
  );

  await workout.save();

  successResponse(res, 200, { workout }, "Exercise removed from workout");
});

/**
 * @desc    Duplicate workout
 * @route   POST /api/workouts/:id/duplicate
 * @access  Private
 */
export const duplicateWorkout = asyncHandler(async (req, res) => {
  const originalWorkout = await Workout.findById(req.params.id);

  if (!originalWorkout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check access
  if (
    originalWorkout.userId.toString() !== req.user._id.toString() &&
    !originalWorkout.isPublic
  ) {
    return errorResponse(res, 403, "Not authorized to access this workout");
  }

  // Create duplicate
  const workoutData = originalWorkout.toObject();
  delete workoutData._id;
  delete workoutData.createdAt;
  delete workoutData.updatedAt;

  workoutData.name = `${workoutData.name} (Copy)`;
  workoutData.userId = req.user._id;
  workoutData.timesCompleted = 0;
  workoutData.lastPerformed = null;

  const duplicatedWorkout = await Workout.create(workoutData);

  successResponse(
    res,
    201,
    { workout: duplicatedWorkout },
    "Workout duplicated successfully"
  );
});

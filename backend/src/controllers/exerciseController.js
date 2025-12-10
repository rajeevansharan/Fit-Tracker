import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import Exercise from "../models/Exercise.js";

/**
 * @desc    Get all exercises
 * @route   GET /api/exercises
 * @access  Private
 */
export const getExercises = asyncHandler(async (req, res) => {
  const { page, limit, category, muscle, difficulty, equipment, search } =
    req.query;

  const query = {};

  // Show default exercises and user's custom exercises
  query.$or = [
    { isCustom: false },
    { isCustom: true, createdBy: req.user._id },
  ];

  // Filters
  if (category) query.category = category;
  if (muscle) query.muscle = muscle;
  if (difficulty) query.difficulty = difficulty;
  if (equipment) query.equipment = equipment;

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  const result = await paginate(Exercise, query, {
    page,
    limit,
    sort: "-usageCount -createdAt",
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single exercise
 * @route   GET /api/exercises/:id
 * @access  Private
 */
export const getExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Check access for custom exercises
  if (
    exercise.isCustom &&
    exercise.createdBy?.toString() !== req.user._id.toString()
  ) {
    return errorResponse(res, 403, "Not authorized to access this exercise");
  }

  successResponse(res, 200, { exercise }, "Exercise retrieved");
});

/**
 * @desc    Create custom exercise
 * @route   POST /api/exercises
 * @access  Private
 */
export const createExercise = asyncHandler(async (req, res) => {
  const exerciseData = {
    ...req.body,
    isCustom: true,
    createdBy: req.user._id,
  };

  const exercise = await Exercise.create(exerciseData);

  successResponse(res, 201, { exercise }, "Exercise created successfully");
});

/**
 * @desc    Update exercise
 * @route   PUT /api/exercises/:id
 * @access  Private
 */
export const updateExercise = asyncHandler(async (req, res) => {
  let exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Only allow updating custom exercises created by the user
  if (
    !exercise.isCustom ||
    exercise.createdBy?.toString() !== req.user._id.toString()
  ) {
    return errorResponse(res, 403, "Not authorized to update this exercise");
  }

  exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  successResponse(res, 200, { exercise }, "Exercise updated successfully");
});

/**
 * @desc    Delete exercise
 * @route   DELETE /api/exercises/:id
 * @access  Private
 */
export const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Only allow deleting custom exercises created by the user
  if (
    !exercise.isCustom ||
    exercise.createdBy?.toString() !== req.user._id.toString()
  ) {
    return errorResponse(res, 403, "Not authorized to delete this exercise");
  }

  await exercise.deleteOne();

  successResponse(res, 200, {}, "Exercise deleted successfully");
});

/**
 * @desc    Get exercise categories
 * @route   GET /api/exercises/meta/categories
 * @access  Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Exercise.distinct("category");

  successResponse(res, 200, { categories }, "Categories retrieved");
});

/**
 * @desc    Get muscle groups
 * @route   GET /api/exercises/meta/muscles
 * @access  Private
 */
export const getMuscleGroups = asyncHandler(async (req, res) => {
  const muscles = await Exercise.distinct("muscle");

  successResponse(res, 200, { muscles }, "Muscle groups retrieved");
});

/**
 * @desc    Get equipment types
 * @route   GET /api/exercises/meta/equipment
 * @access  Private
 */
export const getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Exercise.distinct("equipment");

  successResponse(res, 200, { equipment }, "Equipment types retrieved");
});

import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import prisma from "../lib/prisma.js";

/**
 * @desc    Get all exercises
 * @route   GET /api/exercises
 * @access  Private
 */
export const getExercises = asyncHandler(async (req, res) => {
  const { page, limit, category, muscle, difficulty, equipment, search } =
    req.query;

  const where = {
    OR: [
      { isCustom: false },
      { isCustom: true, userId: req.user.id },
    ],
  };

  // Filters
  if (category) where.category = category;
  if (muscle) where.muscle = muscle;
  if (difficulty) where.difficulty = difficulty;
  if (equipment) where.equipment = equipment;

  // Search
  if (search) {
    where.OR = where.OR.map(condition => ({
      ...condition,
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        }
      ]
    }));
    // Actually, simpler:
    where.AND = [
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
    ];
  }

  const result = await paginate(prisma.exercise, {
    where,
    orderBy: [
      { usageCount: 'desc' },
      { createdAt: 'desc' },
    ],
  }, {
    page,
    limit,
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single exercise
 * @route   GET /api/exercises/:id
 * @access  Private
 */
export const getExercise = asyncHandler(async (req, res) => {
  const exercise = await prisma.exercise.findUnique({
    where: { id: req.params.id }
  });

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Check access for custom exercises
  if (
    exercise.isCustom &&
    exercise.userId !== req.user.id
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
  const {
    name, description, category, muscle, secondaryMuscles,
    equipment, difficulty, instructions, tips, videoUrl, imageUrl
  } = req.body;

  const exercise = await prisma.exercise.create({
    data: {
      name,
      description,
      category,
      muscle,
      secondaryMuscles: secondaryMuscles || [],
      equipment,
      difficulty: difficulty || 'Intermediate',
      instructions: instructions || [],
      tips: tips || [],
      videoUrl,
      imageUrl,
      isCustom: true,
      userId: req.user.id,
    },
  });

  successResponse(res, 201, { exercise }, "Exercise created successfully");
});

/**
 * @desc    Update exercise
 * @route   PUT /api/exercises/:id
 * @access  Private
 */
export const updateExercise = asyncHandler(async (req, res) => {
  let exercise = await prisma.exercise.findUnique({
    where: { id: req.params.id }
  });

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Only allow updating custom exercises created by the user
  if (
    !exercise.isCustom ||
    exercise.userId !== req.user.id
  ) {
    return errorResponse(res, 403, "Not authorized to update this exercise");
  }

  exercise = await prisma.exercise.update({
    where: { id: req.params.id },
    data: req.body,
  });

  successResponse(res, 200, { exercise }, "Exercise updated successfully");
});

/**
 * @desc    Delete exercise
 * @route   DELETE /api/exercises/:id
 * @access  Private
 */
export const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await prisma.exercise.findUnique({
    where: { id: req.params.id }
  });

  if (!exercise) {
    return errorResponse(res, 404, "Exercise not found");
  }

  // Only allow deleting custom exercises created by the user
  if (
    !exercise.isCustom ||
    exercise.userId !== req.user.id
  ) {
    return errorResponse(res, 403, "Not authorized to delete this exercise");
  }

  await prisma.exercise.delete({
    where: { id: req.params.id }
  });

  successResponse(res, 200, {}, "Exercise deleted successfully");
});

/**
 * @desc    Get exercise categories
 * @route   GET /api/exercises/meta/categories
 * @access  Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categoriesData = await prisma.exercise.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const categories = categoriesData.map(c => c.category);

  successResponse(res, 200, { categories }, "Categories retrieved");
});

/**
 * @desc    Get muscle groups
 * @route   GET /api/exercises/meta/muscles
 * @access  Private
 */
export const getMuscleGroups = asyncHandler(async (req, res) => {
  const musclesData = await prisma.exercise.findMany({
    select: { muscle: true },
    distinct: ['muscle'],
  });

  const muscles = musclesData.map(m => m.muscle);

  successResponse(res, 200, { muscles }, "Muscle groups retrieved");
});

/**
 * @desc    Get equipment types
 * @route   GET /api/exercises/meta/equipment
 * @access  Private
 */
export const getEquipment = asyncHandler(async (req, res) => {
  const equipmentData = await prisma.exercise.findMany({
    select: { equipment: true },
    distinct: ['equipment'],
  });

  const equipment = equipmentData.map(e => e.equipment);

  successResponse(res, 200, { equipment }, "Equipment types retrieved");
});

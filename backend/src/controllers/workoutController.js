import {
  asyncHandler,
  successResponse,
  errorResponse,
  paginate,
} from "../utils/helpers.js";
import prisma from "../lib/prisma.js";

/**
 * @desc    Get all workouts for logged in user
 * @route   GET /api/workouts
 * @access  Private
 */
export const getWorkouts = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = req.query;

  const where = { userId: req.user.id };

  // Filter by category
  if (category) {
    where.category = category;
  }

  // Search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const result = await paginate(prisma.workout, {
    where,
    include: {
      exercises: {
        include: {
          exercise: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  }, {
    page,
    limit,
  });

  res.status(200).json(result);
});

/**
 * @desc    Get single workout
 * @route   GET /api/workouts/:id
 * @access  Private
 */
export const getWorkout = asyncHandler(async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: { id: req.params.id },
    include: {
      exercises: {
        include: {
          exercise: true
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check if user owns the workout
  if (
    workout.userId !== req.user.id &&
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
  const {
    name, description, category, difficulty, estimatedDuration,
    tags, isTemplate, isPublic, exercises
  } = req.body;

  const workout = await prisma.workout.create({
    data: {
      userId: req.user.id,
      name,
      description,
      category: category || 'Custom',
      difficulty: difficulty || 'Intermediate',
      estimatedDuration: estimatedDuration || 60,
      tags: tags || [],
      isTemplate: isTemplate || false,
      isPublic: isPublic || false,
      exercises: {
        create: exercises?.map(ex => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          restTime: ex.restTime || 60,
          notes: ex.notes || "",
          order: ex.order,
        })) || []
      }
    },
    include: {
      exercises: true
    }
  });

  successResponse(res, 201, { workout }, "Workout created successfully");
});

/**
 * @desc    Update workout
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
export const updateWorkout = asyncHandler(async (req, res) => {
  let workout = await prisma.workout.findUnique({
    where: { id: req.params.id }
  });

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to update this workout");
  }

  const {
    name, description, category, difficulty, estimatedDuration,
    tags, isTemplate, isPublic, exercises
  } = req.body;

  // For exercises, we delete and recreate to keep it simple, or we can use nested updates.
  // Given the Mongoose logic, a full replacement is often what's expected for arrays.

  const updateData = {
    name,
    description,
    category,
    difficulty,
    estimatedDuration,
    tags,
    isTemplate,
    isPublic,
  };

  // Remove undefined
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  if (exercises) {
    // Transaction to update workout and its exercises
    workout = await prisma.$transaction(async (tx) => {
      // Delete existing exercises
      await tx.workoutExercise.deleteMany({
        where: { workoutId: req.params.id }
      });

      // Update workout and create new exercises
      return await tx.workout.update({
        where: { id: req.params.id },
        data: {
          ...updateData,
          exercises: {
            create: exercises.map(ex => ({
              exerciseId: ex.exerciseId,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight || 0,
              restTime: ex.restTime || 60,
              notes: ex.notes || "",
              order: ex.order,
            }))
          }
        },
        include: {
          exercises: true
        }
      });
    });
  } else {
    workout = await prisma.workout.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        exercises: true
      }
    });
  }

  successResponse(res, 200, { workout }, "Workout updated successfully");
});

/**
 * @desc    Delete workout
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: { id: req.params.id }
  });

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to delete this workout");
  }

  await prisma.workout.delete({
    where: { id: req.params.id }
  });

  successResponse(res, 200, {}, "Workout deleted successfully");
});

/**
 * @desc    Add exercise to workout
 * @route   POST /api/workouts/:id/exercises
 * @access  Private
 */
export const addExerciseToWorkout = asyncHandler(async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: { id: req.params.id },
    include: { exercises: true }
  });

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to modify this workout");
  }

  const newExercise = await prisma.workoutExercise.create({
    data: {
      workoutId: req.params.id,
      exerciseId: req.body.exerciseId,
      name: req.body.name,
      sets: req.body.sets,
      reps: req.body.reps,
      weight: req.body.weight || 0,
      restTime: req.body.restTime || 60,
      notes: req.body.notes || "",
      order: workout.exercises.length + 1,
    }
  });

  const updatedWorkout = await prisma.workout.findUnique({
    where: { id: req.params.id },
    include: { exercises: true }
  });

  successResponse(res, 200, { workout: updatedWorkout }, "Exercise added to workout");
});

/**
 * @desc    Remove exercise from workout
 * @route   DELETE /api/workouts/:id/exercises/:exerciseId
 * @access  Private
 */
export const removeExerciseFromWorkout = asyncHandler(async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: { id: req.params.id },
  });

  if (!workout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check ownership
  if (workout.userId !== req.user.id) {
    return errorResponse(res, 403, "Not authorized to modify this workout");
  }

  await prisma.workoutExercise.delete({
    where: { id: req.params.exerciseId }
  });

  const updatedWorkout = await prisma.workout.findUnique({
    where: { id: req.params.id },
    include: { exercises: true }
  });

  successResponse(res, 200, { workout: updatedWorkout }, "Exercise removed from workout");
});

/**
 * @desc    Duplicate workout
 * @route   POST /api/workouts/:id/duplicate
 * @access  Private
 */
export const duplicateWorkout = asyncHandler(async (req, res) => {
  const originalWorkout = await prisma.workout.findUnique({
    where: { id: req.params.id },
    include: { exercises: true }
  });

  if (!originalWorkout) {
    return errorResponse(res, 404, "Workout not found");
  }

  // Check access
  if (
    originalWorkout.userId !== req.user.id &&
    !originalWorkout.isPublic
  ) {
    return errorResponse(res, 403, "Not authorized to access this workout");
  }

  // Create duplicate
  const duplicatedWorkout = await prisma.workout.create({
    data: {
      userId: req.user.id,
      name: `${originalWorkout.name} (Copy)`,
      description: originalWorkout.description,
      category: originalWorkout.category,
      difficulty: originalWorkout.difficulty,
      estimatedDuration: originalWorkout.estimatedDuration,
      tags: originalWorkout.tags,
      isTemplate: false,
      isPublic: false,
      timesCompleted: 0,
      lastPerformed: null,
      exercises: {
        create: originalWorkout.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime,
          notes: ex.notes,
          order: ex.order,
        }))
      }
    },
    include: {
      exercises: true
    }
  });

  successResponse(
    res,
    201,
    { workout: duplicatedWorkout },
    "Workout duplicated successfully"
  );
});

import express from "express";
import { body } from "express-validator";
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  duplicateWorkout,
} from "../controllers/workoutController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation rules
const createWorkoutValidation = [
  body("name").trim().notEmpty().withMessage("Workout name is required"),
];

const addExerciseValidation = [
  body("exerciseId").notEmpty().withMessage("Exercise ID is required"),
  body("name").trim().notEmpty().withMessage("Exercise name is required"),
  body("sets").isInt({ min: 1 }).withMessage("Sets must be at least 1"),
  body("reps").isInt({ min: 1 }).withMessage("Reps must be at least 1"),
];

// All routes require authentication
router.use(protect);

// Routes
router
  .route("/")
  .get(getWorkouts)
  .post(createWorkoutValidation, validate, createWorkout);

router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout);

router.post("/:id/duplicate", duplicateWorkout);

router
  .route("/:id/exercises")
  .post(addExerciseValidation, validate, addExerciseToWorkout);

router.delete("/:id/exercises/:exerciseId", removeExerciseFromWorkout);

export default router;

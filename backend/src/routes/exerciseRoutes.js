import express from "express";
import { body } from "express-validator";
import {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getCategories,
  getMuscleGroups,
  getEquipment,
} from "../controllers/exerciseController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation rules
const createExerciseValidation = [
  body("name").trim().notEmpty().withMessage("Exercise name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("muscle").notEmpty().withMessage("Primary muscle group is required"),
  body("equipment").notEmpty().withMessage("Equipment type is required"),
  body("difficulty").notEmpty().withMessage("Difficulty level is required"),
  body("instructions")
    .isArray({ min: 1 })
    .withMessage("At least one instruction is required"),
];

// All routes require authentication
router.use(protect);

// Meta routes (must be before /:id routes)
router.get("/meta/categories", getCategories);
router.get("/meta/muscles", getMuscleGroups);
router.get("/meta/equipment", getEquipment);

// CRUD routes
router
  .route("/")
  .get(getExercises)
  .post(createExerciseValidation, validate, createExercise);

router
  .route("/:id")
  .get(getExercise)
  .put(updateExercise)
  .delete(deleteExercise);

export default router;

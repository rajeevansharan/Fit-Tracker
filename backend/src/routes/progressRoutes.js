import express from "express";
import {
  getProgressEntries,
  getProgressEntry,
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  getProgressDashboard,
  getWeightHistory,
} from "../controllers/progressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard and history routes (must be before /:id routes)
router.get("/dashboard", getProgressDashboard);
router.get("/weight-history", getWeightHistory);

// CRUD routes
router.route("/").get(getProgressEntries).post(createProgressEntry);

router
  .route("/:id")
  .get(getProgressEntry)
  .put(updateProgressEntry)
  .delete(deleteProgressEntry);

export default router;

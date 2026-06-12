import express from "express";
import {
  getSessions,
  getSession,
  startSession,
  updateSession,
  completeSession,
  cancelSession,
  deleteSession,
  getWorkoutStats,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id routes)
router.get("/stats/summary", getWorkoutStats);

// CRUD routes
router.route("/").get(getSessions);

router.post("/start", startSession);

router.route("/:id").get(getSession).put(updateSession).delete(deleteSession);

router.post("/:id/complete", completeSession);
router.post("/:id/cancel", cancelSession);

export default router;

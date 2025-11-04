import express from "express";

import { verifyToken } from "../middleware/auth";
import {
  createFeedback,
  deleteFeedback,
  getAllFeedbacks,
  getFeedbackById,
} from "../controllers/feebackController";

const router = express.Router();

// Public route - anyone can submit feedback
router.post("/add", createFeedback);

// Protected routes - require admin authentication
router.get("/get", verifyToken, getAllFeedbacks);
router.get("/get/:id", verifyToken, getFeedbackById);
router.delete("/:id", verifyToken, deleteFeedback);

export default router;

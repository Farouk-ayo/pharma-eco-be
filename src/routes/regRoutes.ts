import express from "express";
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
} from "../controllers/regController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Public route - anyone can register
router.post("/add", createRegistration);

// Protected routes - require admin authentication
router.get("/get", getAllRegistrations);
router.get("/get/:id", verifyToken, getRegistrationById);
router.patch("/:id", verifyToken, updateRegistration);
router.delete("/:id", verifyToken, deleteRegistration);

export default router;

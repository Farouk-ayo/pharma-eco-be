import express from "express";
import {
  registerEMRUser,
  loginEMRUser,
  getCurrentUser,
} from "../controllers/emrAuthController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.post("/register", registerEMRUser);
router.post("/login", loginEMRUser);

export default router;

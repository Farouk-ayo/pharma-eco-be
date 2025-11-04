import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Public routes - anyone can view articles
router.get("/get", getAllArticles);
router.get("/get/:id", getArticleById);

// Protected routes - require admin authentication
router.post("/add", verifyToken, createArticle);
router.patch("/:id", verifyToken, updateArticle);
router.delete("/:id", verifyToken, deleteArticle);

export default router;

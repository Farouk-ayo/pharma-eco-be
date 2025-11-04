import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import regRoutes from "./routes/regRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import articleRoutes from "./routes/articleRoutes";

// Load environment variables
dotenv.config();

// Initialize express
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/admin", authRoutes);
app.use("/register", regRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/article", articleRoutes);

app.get("/", (req, res) => {
  res.json({ message: "PharmaEco API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

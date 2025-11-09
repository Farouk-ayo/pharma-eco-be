import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import regRoutes from "./routes/regRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import articleRoutes from "./routes/articleRoutes";
import whatsappRoutes from "./routes/whatsappRoutes";

// Load environment variables
dotenv.config();

// Initialize express
const app: Application = express();

// Middleware
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://pharma-eco.vercel.app",
      "https://www.pharmaeco.org",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/admin", authRoutes);
app.use("/register", regRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/article", articleRoutes);
app.use("/whatsapp", whatsappRoutes);

app.get("/", (req, res) => {
  res.json({ message: "PharmaEco API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

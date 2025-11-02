import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/admin";
import connectDB from "./config/database";

dotenv.config();

const seedAdmin = async () => {
  try {
    connectDB();
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "pharmaeco1@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("pharmaeco@2025", 10);

    // Create admin
    const admin = new Admin({
      email: "pharmaeco1@gmail.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin created successfully!");
    console.log("Email: pharmaeco1@gmail.com");
    console.log("Password: pharmaeco@2025");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import EMRUser from "../models/emrUser";

// Register EMR User
export const registerEMRUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    if (!firstName || !lastName || !emailAddress || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await EMRUser.findOne({ emailAddress });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    // Create new user
    const user = new EMRUser({
      firstName,
      lastName,
      emailAddress,
      password,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
        },
      },
    });
  } catch (error) {
    console.error("EMR Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login EMR User
export const loginEMRUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user
    const user = await EMRUser.findOne({ emailAddress });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
        },
      },
    });
  } catch (error) {
    console.error("EMR Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.admin?.id; // From JWT middleware

    const user = await EMRUser.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import EMRUser from "../models/emrUser";
import {
  sendPasswordResetEmail,
  // sendOTPEmail,
  sendWelcomeEmail,
} from "../services/email/emailService";

// const generateOTP = (): string => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };
// Register EMR User
export const registerEMRUser = async (
  req: Request,
  res: Response,
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
      authProvider: "email",
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    try {
      await sendWelcomeEmail(user.emailAddress, user.firstName);
    } catch (emailError) {
      console.error("Welcome email failed (non-blocking):", emailError);
    }

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
  res: Response,
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

    // check if email already used for google signup
    if (user.authProvider === "google") {
      res.status(400).json({
        success: false,
        message:
          "This email is registered with Google. Please sign in with Google.",
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
      { expiresIn: "7d" },
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

export const googleAuthCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user as any;

    if (!user) {
      res.redirect(
        `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/signin?error=auth_failed`
      );
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();

    if (isNewUser) {
      try {
        await sendWelcomeEmail(user.emailAddress, user.firstName);
      } catch (emailError) {
        console.error("Welcome email failed (non-blocking):", emailError);
      }
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/google/callback?token=${token}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/signin?error=server_error`
    );
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.admin?.id;

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

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { emailAddress } = req.body;

    if (!emailAddress) {
      res.status(400).json({
        success: false,
        message: "Email address is required",
      });
      return;
    }

    const user = await EMRUser.findOne({ emailAddress });
    if (!user) {
      res.status(200).json({
        success: true,
        message: "If an account exists, a password reset link has been sent",
      });
      return;
    }

    if (user.authProvider === "google") {
      res.status(400).json({
        success: false,
        message:
          "This account uses Google sign-in. Please sign in with Google.",
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    // OTP generation commented out - using link only
    // const otp = generateOTP();
    // user.resetPasswordOTP = crypto.createHash("sha256").update(otp).digest("hex");
    // user.resetPasswordOTPExpires = new Date(Date.now() + 600000);

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/reset-password?token=${resetToken}`;
    try {
      await sendPasswordResetEmail(user.emailAddress, resetUrl, user.firstName);
      // await sendOTPEmail(user.emailAddress, otp, user.firstName);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      // user.resetPasswordOTP = undefined;
      // user.resetPasswordOTPExpires = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Password reset link and code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// OTP verification functions commented out
// export const verifyOTP = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { emailAddress, otp } = req.body;

//     if (!emailAddress || !otp) {
//       res.status(400).json({
//         success: false,
//         message: "Email and OTP are required",
//       });
//       return;
//     }

//     const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

//     const user = await EMRUser.findOne({
//       emailAddress,
//       resetPasswordOTP: hashedOTP,
//       resetPasswordOTPExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//     });
//   } catch (error) {
//     console.error("Verify OTP error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

export const resetPasswordWithOTP = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { emailAddress, otp, password } = req.body;

    if (!emailAddress || !otp || !password) {
      res.status(400).json({
        success: false,
        message: "Email, OTP, and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await EMRUser.findOne({
      emailAddress,
      resetPasswordOTP: hashedOTP,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // user.resetPasswordOTP = undefined;
    // user.resetPasswordOTPExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password with OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await EMRUser.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
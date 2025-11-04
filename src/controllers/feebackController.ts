import { Request, Response } from "express";
import Feedback from "../models/feedback";

// Create new feedback
export const createFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      organizationName,
      message,
      newsUpdates,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber ||
      !organizationName ||
      !message
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
      return;
    }

    // Create new feedback
    const feedback = new Feedback({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      organizationName,
      message,
      newsUpdates: newsUpdates || false,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Feedbacks retrieved successfully",
      data: feedbacks,
      count: feedbacks.length,
    });
  } catch (error) {
    console.error("Get feedbacks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single feedback by ID
export const getFeedbackById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete customer feedback (Admin only)
export const deleteFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

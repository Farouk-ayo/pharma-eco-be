import { Request, Response } from "express";
import Registration from "../models/registration";

// Create new registration
export const createRegistration = async (
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
      city,
      state,
      localGovt,
      zipCode,
      others,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber ||
      !organizationName ||
      !city ||
      !state ||
      !localGovt
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
      return;
    }

    // Create new registration
    const registration = new Registration({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      organizationName,
      city,
      state,
      localGovt,
      zipCode: zipCode || 0,
      others,
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all registrations
export const getAllRegistrations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Registrations retrieved successfully",
      data: registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single registration by ID
export const getRegistrationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Registration retrieved successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Get registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update registration
export const updateRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const registration = await Registration.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Update registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete registration (Admin only)
export const deleteRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

import { Resend } from "resend";
import { render } from "@react-email/render";
import * as React from "react";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { PasswordResetEmail } from "./templates/PasswordResetEmail";
import { OTPEmail } from "./templates/OTPEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (
  to: string,
  firstName: string,
): Promise<void> => {
  try {
    const html = await render(React.createElement(WelcomeEmail, { firstName }));

    await resend.emails.send({
      // from: "PharmaEcoGuard <noreply@pharmaeco.org>",
            from: "PharmaEcoGuard <onboarding@pharmaeco.org>",
      to,
      subject: "Welcome to PharmaEcoGuard EMR",
      html,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string,
  firstName: string,
): Promise<void> => {
  try {
    const html = await render(
      React.createElement(PasswordResetEmail, { firstName, resetUrl }),
    );

    await resend.emails.send({
      from: "PharmaEcoGuard <noreply@pharmaeco.org>",
      to,
      subject: "Reset Your Password - PharmaEcoGuard EMR",
      html,
    });
  } catch (error) {
    console.error("Password reset email error:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendOTPEmail = async (
  to: string,
  otp: string,
  firstName: string,
): Promise<void> => {
  try {
    const html = await render(
      React.createElement(OTPEmail, { firstName, otp }),
    );

    await resend.emails.send({
      from: "PharmaEcoGuard <noreply@pharmaeco.org>",
      to,
      subject: "Your Password Reset Code - PharmaEcoGuard EMR",
      html,
    });
  } catch (error) {
    console.error("OTP email error:", error);
    throw new Error("Failed to send OTP email");
  }
};

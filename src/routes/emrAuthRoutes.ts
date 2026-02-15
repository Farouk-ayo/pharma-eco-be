import express from "express";
import passport from "passport";
import {
  registerEMRUser,
  loginEMRUser,
  getCurrentUser,
  googleAuthCallback,
  forgotPassword,
  resetPassword,
  // verifyOTP,
  // resetPasswordWithOTP,
} from "../controllers/emrAuthController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.post("/register", registerEMRUser);
router.post("/login", loginEMRUser);


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err) {
        console.error("Google OAuth Error:", err.message || err);

        let errorCode = "auth_failed";

        if (err.message === "EMAIL_PASSWORD_EXISTS") {
          errorCode = "email_password_exists";
        } else if (err.message === "NO_EMAIL") {
          errorCode = "no_email";
        } else if (err.message === "GOOGLE_ID_MISMATCH") {
          errorCode = "google_mismatch";
        }

        return res.redirect(
          `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/signin?error=${errorCode}`
        );
      }

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/pharmaeco-guard/auth/signin?error=no_user`
        );
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  googleAuthCallback
);

router.post("/forgot-password", forgotPassword);
// router.post("/verify-otp", verifyOTP);
// router.post("/reset-password-otp", resetPasswordWithOTP);
router.post("/reset-password", resetPassword);

export default router;
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import EMRUser from "../models/emrUser";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL}/emr/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";

        if (!email) {
          return done(new Error("NO_EMAIL"), undefined);
        }

        let user = await EMRUser.findOne({ emailAddress: email });

        if (user) {
          if (user.authProvider === "email") {
            return done(new Error("EMAIL_PASSWORD_EXISTS"), undefined);
          }

          if (user.googleId !== profile.id) {
            return done(new Error("GOOGLE_ID_MISMATCH"), undefined);
          }

          return done(null, user);
        } else {
          user = new EMRUser({
            firstName,
            lastName,
            emailAddress: email,
            googleId: profile.id,
            authProvider: "google",
            password: Math.random().toString(36).slice(-12),
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        console.error("Passport Google Strategy Error:", error);
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await EMRUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
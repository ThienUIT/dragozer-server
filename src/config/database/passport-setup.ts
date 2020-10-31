//Config oauth20
import { GOOGLE_CLIENT_ID, GOOGLE_SECRET } from "@/config/database/config_env";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: "/api/v1/auth/google/redirect",
    },
    // this function call when login google
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log("profile::", profile);
      done(null, profile);
      //done() => go to next function "Google login"
    }
  )
);

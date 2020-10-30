//Config oauth20
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  TEXT_SECRET,
} from "@/config/database/config_env";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserByGoogleSchema = require("@/models/GoogleUser");

passport.serializeUser(
  (userByGoogleSchema: typeof UserByGoogleSchema, done: any) => {
    console.log("serializeUser");
    done(null, userByGoogleSchema.id);
  }
);
passport.deserializeUser(async (id: string, done: any) => {
  console.log("deserializeUser");
  const getInfoUser = await UserByGoogleSchema.findOne({ id: id });
  done(null, getInfoUser);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: "/api/v1/auth/google/redirect",
    },
    // this function call when login google
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const currentUser = await UserByGoogleSchema.findOne({
        googleId: profile.id,
      });
      if (!currentUser) {
        const newUser = await UserByGoogleSchema.create({
          googleId: profile.id,
          channelName: profile.displayName,
          photoUrl: profile.photos[0].value,
        });
        console.log("newUser::", newUser.googleId);
        done(null, newUser);
      }
      console.log("currentUser::", currentUser.googleId);
      done(null, currentUser);
      //done() => go to next function serializeUser
    }
  )
);

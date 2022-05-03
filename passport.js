const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "438731003495-93fds292qhhrilitvm0vrh70g6ljfn05.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/userAuth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

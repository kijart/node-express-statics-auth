const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {
  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((user, callback) => {
    callback(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, callback) => {
    return callback(null, {
      profile: profile,
      accessToken: accessToken
    });
  }));
};

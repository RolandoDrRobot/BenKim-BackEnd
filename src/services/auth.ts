require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
},
function(request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
  return done(null, profile);
}));

passport.serializeUser(function(user:any, done:any) {
  done(null, user);
});

passport.deserializeUser(function(user:any, done:any) {
  done(null, user);
});

const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done
) {
  // verify this email and password,
  User.findOne({ email: email }, function (err, user) {
    if (err) return done(err);
    if (!user) {
      return done(null, false);
    }
    // compare passwords - is `password` === user.password(which is stored encrypted)?
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
  // call done with the user if its the correct email and password
  // otherwise, call done with false
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // payload is the decoded jwt token (the sub and iat props from auth)
  // We want to see if the user id in the payload exists in our db
  // if it does, call 'done' with that user
  // otherwise call done without a user object
  User.findById(payload.sub, function (err, user) {
    if (err) return done(err, false);
    // false means no we didn't find a user
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

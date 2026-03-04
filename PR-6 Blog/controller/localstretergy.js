const passport = require("passport");
const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      let admin = await Admin.findOne({ email: email });

      if (!admin) {
        return done(null, false);
      }

      let matchPass = await bcrypt.compare(password, admin.password);

      if (!matchPass) {
        return done(null, false);
      }

      return done(null, admin);
    },
  ),
);

// Serialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize
passport.deserializeUser(async (id, done) => {
  let admin = await Admin.findById(id);
  if (admin) {
    return done(null, admin);
  }
});

module.exports = passport;

const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "mail" }, (email, password, done) => {
      //match user
      User.findOne({ mail: mail })
        .then((user) => {
          if (!user) {
            return done(null, false, { msg: "That email is not registered" });
          }
          // match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { msg: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  // need to deserialize user according to passport documentation
  // https://youtu.be/6FOq4cUdH8k?t=4219
};

const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "mail" }, (mail, password, done) => {
      //match user
      User.findOne({ mail: mail })
        .then((user) => {
          if (!user) {
            console.log(
              "someone tryed to authenticate with unexisting mail" + mail
            );
            return done(null, false, { msg: "That email is not registered" });
          }
          // match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              console.log("a user tryed to authenticate with good login", user);
              return done(null, user);
            } else {
              console.log(
                'a user tryed to authenticate with bad login. Here is his mail : "',
                user.mail,
                '" user tryed this wrong password = "',
                password,
                '"'
              );
              return done(null, false, { msg: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

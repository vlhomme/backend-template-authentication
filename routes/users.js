const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//user model
const User = require("../models/User");

//Handle Register
router.post("/register", (req, res) => {
  const { firstname, lastname, mail, password } = req.body;
  let errors = [];
  if (!firstname || !lastname || !mail || !password) {
    errors.push({ msg: "veuillez remplir tous les champs !" });
  }

  if (password.length < 6) {
    errors.push({
      msg: "le mot de passe doit comprendre 6 caractères minimum",
    });
  }

  if (errors.length > 0) {
    res.send(JSON.stringify(errors));
  } else {
    // validation passed
    User.findOne({ mail: mail }).then((user) => {
      if (user) {
        // user exists
        errors.push({
          msg: "cette adresse mail correspond déjà à un compte existant",
        });
        res.send(JSON.stringify(errors));
      } else {
        const newUser = new User({
          firstname,
          lastname,
          mail,
          password,
        });

        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            // set password to hash
            newUser.password = hash;
            // register user to db
            newUser
              .save()
              .then((user) => res.send(JSON.stringify(user)))
              .catch((erRor) => console.log(erRor));
          });
        });
        // res.send("user created boomer");
      }
    });
  }
});

// handle login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(JSON.stringify(info));
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(JSON.stringify(user));
    });
  })(req, res, next);
});

module.exports = router;

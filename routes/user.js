var config = require("../config");
var express = require("express");
var router = express.Router();
var passport = require("passport");
var uid2 = require("uid2");
var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
var confirmEmail = require("../emails/confirmationEmail");

var User = require("../models/User.js");

router.post("/sign_up", function(req, res) {
  User.register(
    new User({
      email: req.body.email,
      token: uid2(32), // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.
      emailCheck: {
        token: uid2(20),
        createdAt: new Date()
      },
      account: {
        name: req.body.name,
        description: req.body.description
      }
    }),
    req.body.password, // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    function(err, user) {
      if (err) {
        if (config.ENV !== "test") {
          console.error(err);
        }
        // TODO test
        res.status(400).json({ error: err.message });
      } else {
        var url = req.headers.host;
        // sending mails only in production ENV
        if (config.ENV === "production") {
          mailgun
            .messages()
            .send(confirmEmail(url, user), function(error, body) {
              console.error("Mail Error", error);
              console.log("Mail Body", body);
              res.json({
                message: "User successfully signed up",
                user: {
                  _id: user._id,
                  token: user.token,
                  account: user.account
                }
              });
            });
        } else {
          res.json({
            message: "User successfully signed up",
            user: {
              _id: user._id,
              token: user.token,
              account: user.account
            }
          });
        }
      }
    }
  );
});

router.post("/log_in", function(req, res, next) {
  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      res.status(400);
      return next(err.message);
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!user.emailCheck.valid) {
      return res.status(206).json({ message: "Please confirm email first" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        token: user.token,
        account: user.account
      }
    });
  })(req, res, next);
});

router.route("/emailCheck").get(function(req, res) {
  var token = req.query.token;
  var email = req.query.email;
  if (!token) return res.status(400).send("No token specified");
  User.findOne({ "emailCheck.token": token, email: email }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(400).send("Invalid token or email");
    if (user.emailCheck.valid)
      return res
        .status(206)
        .json({ message: "You have already confirmed your email" });
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (user.emailCheck.createdAt < yesterday)
      return res.status(400).json({
        message:
          "This link is outdated (older than 24h), please try to sign up again"
      });
    user.emailCheck.valid = true;
    user.save(function(err) {
      if (err) return res.send(err);
      res.json({ message: "Your email has been verified with success" });
    });
  });
});

router.route("/forgotten_password").post(function(req, res) {
  var email = req.body.email;
  if (!email) return res.status(400).json({ error: "No email provided" });
  User.findOne({ email: email }, function(err, user) {
    if (err) return res.status(400).send(err);
    if (!user)
      return res.status(400).json({
        error: "We don't have a user with this email in our dataBase"
      });
    if (!user.emailCheck.valid)
      return res.status(400).json({ error: "Your email is not confirmed" });
    if (config.ENV === "production") {
      mailgun.messages().send(confirmEmail(url, user), function(error, body) {
        console.error("Mail Error", error);
        console.log("Mail Body", body);
      });
    }
    res.json({
      message: "An email has been send with a link to change your password"
    });
  });
});

// L'authentification est obligatoire pour cette route
router.get("/:id", function(req, res, next) {
  passport.authenticate("bearer", { session: false }, function(
    err,
    user,
    info
  ) {
    if (err) {
      res.status(400);
      return next(err.message);
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    User.findById(req.params.id)
      .select("account")
      .populate("account.rooms")
      .populate("account.favorites")
      .exec()
      .then(function(user) {
        if (!user) {
          res.status(404);
          return next("User not found");
        }

        return res.json({
          _id: user._id,
          account: user.account
        });
      })
      .catch(function(err) {
        res.status(400);
        return next(err.message);
      });
  })(req, res, next);
});

module.exports = router;

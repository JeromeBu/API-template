var express = require("express");
var router = express.Router();
var passport = require("passport");
var uid2 = require("uid2");

var User = require("../models/User.js");

router.post("/sign_up", function(req, res) {
  User.register(
    new User({
      email: req.body.email,
      // L'inscription créera le token permettant de s'authentifier auprès de la strategie `http-bearer`
      token: uid2(16), // uid2 permet de générer une clef aléatoirement. Ce token devra être regénérer lorsque l'utilisateur changera son mot de passe
      account: {
        username: req.body.username,
        name: req.body.name,
        description: req.body.description
      }
    }),
    req.body.password, // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    function(err, user) {
      if (err) {
        console.error(err);
        // TODO test
        res.status(400).json({ error: err.message });
      } else {
        res.json({ _id: user._id, token: user.token, account: user.account });
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
    res.json({
      _id: user._id,
      token: user.token,
      account: user.account
    });
  })(req, res, next);
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

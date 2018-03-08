var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  shortId: Number, // shortId is useful when seeding data, it facilitates associations
  email: String,
  emailCheck: {
    valid: { type: Boolean, default: false },
    token: String,
    createdAt: Date
  },
  passwordChange: {
    valid: { type: Boolean, default: true },
    token: String,
    createdAt: Date
  },
  password: String,
  token: String, // Le token permettra d'authentifier l'utilisateur à l'aide du package `passport-http-bearer`

  // Here`account` is for public information
  account: {
    name: String,
    description: String,
    photos: [String],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
      }
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
      }
    ]
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // L'authentification utilisera `email` plutôt `username`
  session: false // L'API ne nécessite pas de sessions
});

// Cette méthode sera utilisée par la strategie `passport-local` pour trouver un utilisateur en fonction de son `email` et `password`
UserSchema.statics.authenticateLocal = function() {
  var _self = this;
  return function(req, email, password, cb) {
    _self.findByUsername(email, true, function(err, user) {
      if (err) return cb(err);
      if (user) {
        return user.authenticate(password, cb);
      } else {
        return cb(null, false);
      }
    });
  };
};

// Cette méthode sera utilisée par la strategie `passport-http-bearer` pour trouver un utilisateur en fonction de son `token`
UserSchema.statics.authenticateBearer = function() {
  var _self = this;
  return function(token, cb) {
    if (!token) {
      cb(null, false);
    } else {
      _self.findOne({ token: token }, function(err, user) {
        if (err) return cb(err);
        if (!user) return cb(null, false);
        return cb(null, user);
      });
    }
  };
};

module.exports = mongoose.model("User", UserSchema, "users");

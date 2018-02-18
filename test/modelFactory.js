var uid = require("uid2");
var User = require("../models/User");
//  options: email, token, password, emailCheckValid, emailCheckToken, emailCheckCreatedAt, name, description
function user(options = {}, callback) {
  var password = options.password || "password";
  var newUser = new User({
    email: options.email || "emailCheck@testing.com",
    token: options.token || uid(32),
    emailCheck: {
      valid: options.emailCheckValid || false,
      token: options.emailCheckToken || uid(20),
      createdAt: options.emailCheckCreatedAt || new Date()
    },
    account: {
      name: options.name || "Testing emailCheck",
      description: options.description || "An awesome description"
    }
  });
  User.register(newUser, password, function(err, user) {
    if (err) {
      console.error("Could not create user : " + err);
    } else {
      console.log("user created with succes");
      callback(user);
    }
  });
}

module.exports = { user: user };

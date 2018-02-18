var uid = require("uid2");
var User = require("../models/User");

function validUser() {
  let emailToken = uid(20);
  return new User({
    email: "emailCheck@testing.com",
    token: uid(32),
    password: "mypassword",
    emailCheck: {
      valid: false,
      token: emailToken,
      createdAt: new Date()
    },
    account: {
      name: "Testing emailCheck"
    }
  });
}

module.exports = { validUser: validUser };

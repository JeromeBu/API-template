var uid = require("uid2");
var User = require("../server/api/user/model");
//  options: email, token, password, emailCheckValid, emailCheckToken, emailCheckCreatedAt, name, description
function user(options, callback) {
  const promise = new Promise((resolve, reject) => {
    var password = options.password || "password";
    var newUser = new User({
      email: options.email || "emailCheck@testing.com",
      token: options.token || uid(32),
      emailCheck: {
        valid: options.emailCheckValid === false ? false : true,
        token: options.emailCheckToken || uid(20),
        createdAt: options.emailCheckCreatedAt || new Date()
      },
      passwordChange: {
        valid: options.passwordChangeValid === false ? false : true,
        token: options.passwordChangeToken || uid(20),
        createdAt: options.passwordChangeCreatedAt || new Date()
      },
      account: {
        name: options.name || "Testing emailCheck",
        description: options.description || "An awesome description"
      }
    });
    User.register(newUser, password, function(err, user) {
      if (err) {
        if (!callback) {
          reject("Could not create user : " + err);
        } else {
          console.error("Could not create user : " + err);
        }
      } else {
        if (!callback) {
          resolve(user);
        } else {
          callback(user);
        }
      }
    });
  });
  return promise;
}

module.exports = { user: user };

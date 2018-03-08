let server = require("../server");

var User = require("../models/User");
var factory = require("./00-modelFactory");

var chai = require("chai");
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Recovery of password", function() {
  describe("POST /api/user/forgotten_password", function() {
    beforeEach(done => {
      User.remove({}, err => {
        done();
      });
    });
    it("Returns a message if unknowm email", function(done) {
      let body = {
        email: "wrong@mail.com"
      };
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(body)
        .end(function(err, res) {
          // should.not.exist(err);
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include(
              "We don't have a user with this email in our dataBase"
            );
          done();
        });
    });
    it("Returns a message if no email provided", function(done) {
      let body = {};
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(body)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No email specified");
          done();
        });
    });
    it("Returns a message if email is not confirmed", function(done) {
      factory.user({ emailCheckValid: false }, function(user) {
        let body = {
          email: user.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(body)
          .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.a("object");
            res.body.should.have
              .property("error")
              .that.include("Your email is not confirmed");
            done();
          });
      });
    });
    it("Sends an email to redefine password", function(done) {
      factory.user({ emailCheckValid: true }, function(validUser) {
        let body = {
          email: validUser.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(body)
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.a("object");
            res.body.should.have
              .property("message")
              .that.include(
                "An email has been send with a link to change your password"
              );
            done();
          });
      });
    });
  });

  describe("GET /api/user/reset_password", function() {
    const options = {
      validEmailUser: null,
      notValidEmailUser: null,
      outDatedTokenUser: null,
      alreadyUsedLinkUser: null
    };
    const httpVerb = "get";
    // IIFE
    before(createTestUsers(options));
    it("Raise error if no email given", function(done) {
      noEmailGiven(done, httpVerb);
    });
    it("Raise error if no token given", function(done) {
      noTokenGiven(done, httpVerb);
    });
    it("Raise error if email is not in database", function(done) {
      emailNotInDb(done, httpVerb);
    });
    it("Raise error if token doen't match users changing password token", function(done) {
      wrongToken(done, httpVerb, validEmailUser);
    });
    it("Raise error if the change password link has already been used", function(done) {
      linkUsed(done, httpVerb, alreadyUsedLinkUser);
    });
    it("Raise error if user.passwordChange.token is outdated", function(done) {
      tokenOutdated(done, httpVerb, outDatedTokenUser);
    });
    it("Raise error if user has not validated email", function(done) {
      notValidEmail(done, httpVerb, notValidEmailUser);
    });
    it("Authorize Reset password page when user is OK ", function(done) {
      authorizeAccess(done, httpVerb, validEmailUser);
    });
  });

  describe("POST /api/user/reset_password", function() {
    const options = {
      validEmailUser: null,
      notValidEmailUser: null,
      outDatedTokenUser: null,
      alreadyUsedLinkUser: null
    };
    const httpVerb = "post";
    before(createTestUsers(options));
    it("Raise error if no email given", function(done) {
      noEmailGiven(done, httpVerb);
    });
    it("Raise error if no token given", function(done) {
      noTokenGiven(done, httpVerb);
    });
    it("Raise error if email is not in database", function(done) {
      emailNotInDb(done, httpVerb);
    });
    it("Raise error if token doen't match users changing password token", function(done) {
      wrongToken(done, httpVerb, validEmailUser);
    });
    it("Raise error if the change password link has already been used", function(done) {
      linkUsed(done, httpVerb, alreadyUsedLinkUser);
    });
    it("Raise error if user.passwordChange.token is outdated", function(done) {
      tokenOutdated(done, httpVerb, outDatedTokenUser);
    });
    it("Raise error if user has not validated email", function(done) {
      notValidEmail(done, httpVerb, notValidEmailUser);
    });
    it("Raise error if no password given", function(done) {
      body = {};
      chai
        .request(server)
        .post(
          `/api/user/reset_password?email=${validEmailUser.email}&token=${
            validEmailUser.passwordChange.token
          }`
        )
        .send(body)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No password provided");
          done();
        });
    });
    it("Raise error if confirmation doesn't match password", function(done) {
      body = {
        newPassword: "newpassword",
        newPasswordConfirmation: "somethingElse"
      };
      chai
        .request(server)
        .post(
          `/api/user/reset_password?email=${validEmailUser.email}&token=${
            validEmailUser.passwordChange.token
          }`
        )
        .send(body)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("Password and confirmation are different");
          done();
        });
    });
    it("Changes the password", function(done) {
      body = {
        newPassword: "brandNewPassword",
        newPasswordConfirmation: "brandNewPassword"
      };
      chai
        .request(server)
        .post(
          `/api/user/reset_password?email=${validEmailUser.email}&token=${
            validEmailUser.passwordChange.token
          }`
        )
        .send(body)
        .end(function(err, res) {
          should.not.exist(err);
          res.should.be.a("object");
          res.body.should.have
            .property("message")
            .that.include("Password reset successfully");
          done();
        });
    });
  });
});

function createTestUsers(options) {
  return async function() {
    const initialPassword = "old_password";
    try {
      await User.remove({}, err => {});
      validEmailUser = await factory.user({
        email: "validEmail@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: true
      });
      notValidEmailUser = await factory.user({
        email: "notValidEmail@mail.com",
        emailCheckValid: false,
        password: initialPassword,
        passwordChangeValid: true
      });
      alreadyUsedLinkUser = await factory.user({
        email: "alreadyUsedLink@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: false
      });
      let threeHoursAgo = new Date();
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
      outDatedTokenUser = await factory.user({
        email: "outDatedToken@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: true,
        passwordChangeCreatedAt: threeHoursAgo
      });
    } catch (e) {
      console.error(e);
    }
  };
}

function noEmailGiven(done, verb, body = {}) {
  let request = chai.request(server)[verb](`/api/user/reset_password`);
  if (verb === "post") request = request.send(body);

  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("No email specified");
    done();
  });
}

function noTokenGiven(done, verb, body = {}) {
  let request = chai
    .request(server)
    [verb](`/api/user/reset_password?email=hello@mail.com`);
  if (verb === "post") request = request.send(body);

  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("No token specified");
    done();
  });
}

function emailNotInDb(done, verb, body = {}) {
  let request = chai
    .request(server)
    [verb](`/api/user/reset_password?email=hello@mail.com&token=some_token`);
  if (verb === "post") request = request.send(body);

  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("Wrong credentials");
    done();
  });
}

function wrongToken(done, verb, validEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/api/user/reset_password?email=${validEmailUser.email}&token=some_token`
    );
  if (verb === "post") request = request.send(body);

  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("Wrong credentials");
    done();
  });
}

function linkUsed(done, verb, alreadyUsedLinkUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/api/user/reset_password?email=${alreadyUsedLinkUser.email}&token=${
        alreadyUsedLinkUser.passwordChange.token
      }`
    );
  if (verb === "post") request = request.send(body);
  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have
      .property("error")
      .that.include("link has already been used");
    done();
  });
}

function tokenOutdated(done, verb, outDatedTokenUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/api/user/reset_password?email=${outDatedTokenUser.email}&token=${
        outDatedTokenUser.passwordChange.token
      }`
    );
  if (verb === "post") request = request.send(body);
  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("Outdated link");
    res.body.should.have.property("message").that.include("link is outdated");
    done();
  });
}

function notValidEmail(done, verb, notValidEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/api/user/reset_password?email=${notValidEmailUser.email}&token=${
        notValidEmailUser.passwordChange.token
      }`
    );
  if (verb === "post") request = request.send(body);
  request.end(function(err, res) {
    res.should.have.status(401);
    res.should.be.a("object");
    res.body.should.have.property("error").that.include("Email not confirmed");
    res.body.should.have
      .property("message")
      .that.include("validate your email first");
    done();
  });
}

function authorizeAccess(done, verb, validEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/api/user/reset_password?email=${validEmailUser.email}&token=${
        validEmailUser.passwordChange.token
      }`
    );
  if (verb === "post") request = request.send(body);
  request.end(function(err, res) {
    should.not.exist(err);
    res.should.be.a("object");
    res.body.should.have
      .property("message")
      .that.include("Ready to recieve new password");
    done();
  });
}

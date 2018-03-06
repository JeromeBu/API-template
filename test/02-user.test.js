let server = require("../server");

var User = require("../models/User");
var factory = require("./00-modelFactory");

var chai = require("chai");
var expect = require("chai").expect;
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Users", () => {
  after(function() {
    server.close();
  });
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("POST /api/user/sign_up", function() {
    it("Not POST a user without password field", done => {
      let user = {
        name: "Name: No password given",
        email: "test@mail.com"
      };
      chai
        .request(server)
        .post("/api/user/sign_up")
        .send(user)
        .end((err, res) => {
          // should.not.exist(err);
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.include("No password was given");
          // res.body.errors.password.should.have.property("kind").eql("required");
          done();
        });
    });
    it("Not POST a user without email field", done => {
      let user = {
        name: "Name: No email given",
        password: "password"
      };
      chai
        .request(server)
        .post("/api/user/sign_up")
        .send(user)
        .end((err, res) => {
          // should.not.exist(err);
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.include("No username was given"); // TODO: change username with email
          done();
        });
    });
    it("Not POST a user if email is already taken", done => {
      factory
        .user({
          email: "alreadyTaken@mail.com",
          emailCheckValid: true
        })
        .then(function(validUser) {
          let newUser = {
            email: validUser.email,
            password: "password"
          };
          chai
            .request(server)
            .post("/api/user/sign_up")
            .send(newUser)
            .end((err, res) => {
              // should.not.exist(err);
              res.should.have.status(400);
              res.body.should.be.a("object");
              res.body.should.have.property("error");
              res.body.error.should.include(
                "given username is already registered"
              );
              done();
            });
        });
    });
    it("POST a user", done => {
      let user = {
        email: "passing@mail.com",
        name: "Name: schould pass",
        password: "password"
      };
      chai
        .request(server)
        .post("/api/user/sign_up")
        .send(user)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("User successfully signed up");
          res.body.user.should.have.property("token");
          res.body.user.should.have.property("account");
          done();
        });
    });
  });

  describe("POST /api/user/log_in", function() {
    it("Returns user infos and token", function(done) {
      var password = "superpassword";
      factory.user({ emailCheckValid: true, password: password }, function(
        validUser
      ) {
        let request = {
          email: validUser.email,
          password: password
        };
        chai
          .request(server)
          .post(`/api/user/log_in`)
          .send(request)
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(200);
            res.body.should.have
              .property("message")
              .that.include("Login successful");
            res.body.should.have.property("user");
            res.body.user.should.have.property("token");
            done();
          });
      });
    });
    it("Returns Unauthorized when wrong password", function(done) {
      var password = "superpassword";
      factory.user({ emailCheckValid: true, password: password }, function(
        validUser
      ) {
        let request = {
          email: validUser.email,
          password: "wrongpassword"
        };
        chai
          .request(server)
          .post(`/api/user/log_in`)
          .send(request)
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(401);
            res.body.should.have.property("error").that.include("Unauthorized");
            done();
          });
      });
    });
    it("Returns Unauthorized when no user find with email", function(done) {
      var password = "superpassword";
      factory.user({ emailCheckValid: true, password: password }, function(
        validUser
      ) {
        let request = {
          email: "wrong@mail.com",
          password: "superpassword"
        };
        chai
          .request(server)
          .post(`/api/user/log_in`)
          .send(request)
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(401);
            res.body.should.have.property("error").that.include("Unauthorized");
            done();
          });
      });
    });
    it("Asks to confirm email if not validated", function(done) {
      var password = "superpassword";
      factory.user({ emailCheckValid: false, password: password }, function(
        user
      ) {
        let request = {
          email: user.email,
          password: password
        };
        chai
          .request(server)
          .post(`/api/user/log_in`)
          .send(request)
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(206);
            res.body.should.have
              .property("message")
              .that.include("confirm email");
            done();
          });
      });
    });
  });

  describe("GET /api/user/email_check", function() {
    it("Confirms email", function(done) {
      factory.user({ emailCheckValid: false }, function(user) {
        chai
          .request(server)
          .get(
            `/api/user/email_check?token=${user.emailCheck.token}&email=${
              user.email
            }`
          )
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.should.be.a("object");
            res.body.should.have
              .property("message")
              .that.include("Your email has been verified with success");
            done();
          });
      });
    });
    it("Responds an error when called without token", function(done) {
      chai
        .request(server)
        .get("/api/user/email_check")
        .end(function(err, res) {
          // expect(err).to.be.null;
          res.should.have.status(400);
          res.should.be.a("object");
          res.text.should.include("No token specified");
          done();
        });
    });
    it("Responds an error when called with invalid token", function(done) {
      chai
        .request(server)
        .get("/api/user/email_check?token=unexistingToken&email=email@mail.com")
        .end(function(err, res) {
          // expect(err).to.be.null;
          // expect(res).to.be.json;
          res.should.have.status(400);
          res.should.be.a("object");
          res.text.should.include("Wrong credentials");
          done();
        });
    });
    it("Responds already valid when called on already valid user", function(done) {
      factory.user({ emailCheckValid: true }, function(validUser) {
        chai
          .request(server)
          .get(
            `/api/user/email_check?token=${validUser.emailCheck.token}&email=${
              validUser.email
            }`
          )
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(206);
            res.should.be.a("object");
            res.body.should.have
              .property("message")
              .that.include("You have already confirmed your email");
            done();
          });
      });
    });
  });
});

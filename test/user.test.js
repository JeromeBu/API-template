require("dotenv").config();
var config = require("../config");

var mongoose = require("mongoose");

var User = require("../models/User");
var factory = require("./modelFactory");

let server = require("../server");
var chai = require("chai");
var expect = require("chai").expect;
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

// const url = "http://localhost:" + config.PORT;
describe("Users", () => {
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("POST /api/user/sign_up", function() {
    it("it should not POST a user without password field", done => {
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
    it("it should not POST a user without email field", done => {
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
          res.body.error.should.include("No username was given");
          // res.body.errors.password.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a user", done => {
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

  describe("GET /api/user/emailCheck", function() {
    it("It should confirm email", function(done) {
      factory.user({}, function(validUser) {
        chai
          .request(server)
          .get(
            `/api/user/emailCheck?token=${validUser.emailCheck.token}&email=${
              validUser.email
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
    it("respond an error when called without token", function(done) {
      chai
        .request(server)
        .get("/api/user/emailCheck")
        .end(function(err, res) {
          // expect(err).to.be.null;
          res.should.have.status(400);
          res.should.be.a("object");
          res.text.should.include("No token specified");
          done();
        });
    });
    it("respond an error when called with invalid token", function(done) {
      chai
        .request(server)
        .get("/api/user/emailCheck?token=unexistingToken&email=email@mail.com")
        .end(function(err, res) {
          // expect(err).to.be.null;
          // expect(res).to.be.json;
          res.should.have.status(400);
          res.should.be.a("object");
          res.text.should.include("Invalid token or email");
          done();
        });
    });
    it("respond respond already valid when called on already valid user", function(done) {
      factory.user({ emailCheckValid: true }, function(validUser) {
        chai
          .request(server)
          .get(
            `/api/user/emailCheck?token=${validUser.emailCheck.token}&email=${
              validUser.email
            }`
          )
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            console.log(res.body);
            res.should.have.status(206);
            res.body.should.have
              .property("message")
              .that.include("You have already confirmed your email");
            done();
          });
      });
    });
  });

  describe("POST /api/user/log_in", function() {
    it("It should return user infos and token", function(done) {
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
  });
});

// setTimeout(() => {
//   console.log("disconnectiong DB");
//   mongoose.connection.close();
// }, 5000);

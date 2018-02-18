require("dotenv").config();
var config = require("../config");

var mongoose = require("mongoose");

var User = require("../models/User");

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
      let emailToken = "GsRPTjbvwvswqnPqJCw7";
      let validUser = new User({
        email: "emailCheck@testing.com",
        token: "hQOEFzqnIjWUWa0m7SGGHZ9SdLqX0000",
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
      validUser.save();
      chai
        .request(server)
        .get(`/api/user/emailCheck?token=${emailToken}`)
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

    it("respond an error when called without token", function(done) {
      chai
        .request(server)
        .get("/api/user/emailCheck")
        .end(function(err, res) {
          // expect(err).to.be.null;
          // expect(res).to.be.json;
          expect(res).to.have.status(400);
          res.should.be.a("object");
          expect(res.text).to.equal("No token specified");
          done();
        });
    });

    it("respond an error when called with invalid token", function(done) {
      chai
        .request(server)
        .get("/api/user/emailCheck?token=unexistingToken")
        .end(function(err, res) {
          // expect(err).to.be.null;
          // expect(res).to.be.json;
          expect(res).to.have.status(400);
          res.should.be.a("object");
          expect(res.text).to.equal("Invalid token");
          done();
        });
    });
    it("respond respond already valid when called on already valid user", function(done) {
      let emailToken = "GsRPTjbvwvswqnPqJCw7";
      let validUser = new User({
        email: "emailCheck@testing.com",
        token: "hQOEFzqnIjWUWa0m7SGGHZ9SdLqX0000",
        password: "mypassword",
        emailCheck: {
          valid: true,
          token: emailToken,
          createdAt: new Date()
        },
        account: {
          name: "Testing emailCheck"
        }
      });
      validUser.save();
      chai
        .request(server)
        .get(`/api/user/emailCheck?token=${emailToken}`)
        .end(function(err, res) {
          // expect(err).to.be.null;
          // expect(res).to.be.json;
          res.should.have.status(206);
          res.body.should.have
            .property("message")
            .that.include("You have already confirmed your email");
          done();
        });
    });
  });
});

// setTimeout(() => {
//   console.log("disconnectiong DB");
//   mongoose.connection.close();
// }, 5000);

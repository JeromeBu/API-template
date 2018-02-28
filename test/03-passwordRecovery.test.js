let server = require("../server");

var User = require("../models/User");
var factory = require("./00-modelFactory");

var chai = require("chai");
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Recovery of password", function() {
  after(function() {
    server.close();
    server.mongooseDisconnect(); // Needed in order to stop mocha from running
  });
  describe("POST /api/user/forgotten_password", function() {
    beforeEach(done => {
      User.remove({}, err => {
        done();
      });
    });
    it("Returns a message if unknowm email", function(done) {
      let request = {
        email: "wrong@mail.com"
      };
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(request)
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
      let request = {};
      chai
        .request(server)
        .post(`/api/user/forgotten_password`)
        .send(request)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have
            .property("error")
            .that.include("No email provided");
          done();
        });
    });
    it("Returns a message if email is not confirmed", function(done) {
      factory.user({ emailCheckValid: false }, function(user) {
        let request = {
          email: user.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(request)
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
        let request = {
          email: validUser.email
        };
        chai
          .request(server)
          .post(`/api/user/forgotten_password`)
          .send(request)
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
    let validEmailUser = null;
    let notValidEmailUser = null;
    before(async function() {
      const initialPassword = "old_password";

      try {
        validEmailUser = await factory.user({
          email: "validEmail@mail.com",
          emailCheckValid: true,
          password: initialPassword,
          passwordChangeValid: true
        });
        notValidEmailUser = await factory.user({
          email: "notValid@mail.com",
          emailCheckValid: false,
          password: initialPassword,
          passwordChangeValid: true
        });
      } catch (e) {
        console.error(e);
      }
    });
    it("Raise error if no email given", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("Error")
            .that.include("No email was given");
          done();
        });
    });
    it("Raise error if no token given", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password?email=hello@mail.com`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("Error")
            .that.include("No token was given");
          done();
        });
    });
    it("Raise error if email is not in database?email=hello@mail.com&token=some_token", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("Error")
            .that.include("Wrong credentials");
          done();
        });
    });
    it("Raise error if token doen't match users changing password token", function(done) {
      chai
        .request(server)
        .get(`/api/user/reset_password`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.a("object");
          res.body.should.have
            .property("Error")
            .that.include("Wrong credentials");
          done();
        });
    });
  });

  // it("Changes the password", function(done) {
  //   const initialPassword = "old_password";
  //   factory.user(
  //     {
  //       emailCheckValid: true,
  //       password: initialPassword,
  //       passwordChangeValid: true
  //     },
  //     function(validUser) {
  //       const request = {
  //         newPassword: "new_password",
  //         confirmPassword: "new_password"
  //       };
  //       chai
  //         .request(server)
  //         .post(
  //           `/api/user/reset_password?token=${
  //             validUser.passwordChange.token
  //           }&email=${validUser.email}`
  //         )
  //         .send(request)
  //         .end(function(err, res) {
  //           should.not.exist(err);
  //           res.should.have.status(200);
  //           res.should.be.a("object");
  //           res.body.should.have
  //             .property("message")
  //             .that.include("Password updated with success");
  //           done();
  //         });
  //     }
  //   );
  // }); // end of it (change the password)

  // describe("GET /api/user/new_password", function() {
  //   it("Sends an email to redefine password", function(done) {
  //     factory.user({ emailCheckValid: true }, function(validUser) {
  //       let request = {
  //         email: validUser.email
  //       };
  //       chai
  //         .request(server)
  //         .post(`/api/user/forgotten_password`)
  //         .send(request)
  //         .end(function(err, res) {
  //           should.not.exist(err);
  //           res.should.have.status(200);
  //           res.should.be.a("object");
  //           res.body.should.have
  //             .property("message")
  //             .that.include(
  //               "An email has been send with a link to change your password"
  //             );
  //           done();
  //         });
  //     });
  //   });
  // });
  describe("POST /api/user/reset_password", function() {
    it("Raise error if token belongs to no one", function(done) {
      const initialPassword = "old_password";
      factory.user(
        {
          emailCheckValid: true,
          password: initialPassword,
          passwordChangeValid: true
        },
        function(validUser) {
          const request = {
            newPassword: "new_password",
            confirmPassword: "new_password"
          };
          chai
            .request(server)
            .post(
              `/api/user/reset_password?token=${"a_wrong_token"}&email=${
                validUser.email
              }`
            )
            .send(request)
            .end(function(err, res) {
              should.not.exist(err);
              res.should.have.status(200);
              res.should.be.a("object");
              res.body.should.have
                .property("message")
                .that.include("Password updated with success");
              done();
            });
        }
      );
    });
    // it("Changes the password", function(done) {
    //   const initialPassword = "old_password";
    //   factory.user(
    //     {
    //       emailCheckValid: true,
    //       password: initialPassword,
    //       passwordChangeValid: true
    //     },
    //     function(validUser) {
    //       const request = {
    //         newPassword: "new_password",
    //         confirmPassword: "new_password"
    //       };
    //       chai
    //         .request(server)
    //         .post(
    //           `/api/user/reset_password?token=${
    //             validUser.passwordChange.token
    //           }&email=${validUser.email}`
    //         )
    //         .send(request)
    //         .end(function(err, res) {
    //           should.not.exist(err);
    //           res.should.have.status(200);
    //           res.should.be.a("object");
    //           res.body.should.have
    //             .property("message")
    //             .that.include("Password updated with success");
    //           done();
    //         });
    //     }
    //   );
    // });
  });
});

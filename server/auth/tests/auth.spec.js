const chai = require("chai")
const should = require("chai").should()
const chaiHttp = require("chai-http")
chai.use(chaiHttp)

const server = require("../../../index")
const User = require("../../api/user/model")
const factory = require("../../utils/modelFactory")

describe("Authentication and password recovery", () => {
  describe("Authentication", () => {
    beforeEach(done => {
      User.remove({}, err => {
        done()
      })
    })

    describe("POST /auth/sign_up", function() {
      it("Not POST a user without password field", done => {
        let user = {
          name: "Name: No password given",
          email: "test@mail.com"
        }
        chai
          .request(server)
          .post("/auth/sign_up")
          .send(user)
          .end((err, res) => {
            // should.not.exist(err);
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
            res.body.error.should.include("No password was given")
            // res.body.errors.password.should.have.property("kind").eql("required");
            done()
          })
      })
      it("Not POST a user without email field", done => {
        let user = {
          name: "Name: No email given",
          password: "password"
        }
        chai
          .request(server)
          .post("/auth/sign_up")
          .send(user)
          .end((err, res) => {
            // should.not.exist(err);
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
            res.body.error.should.include("No username was given") // TODO: change username with email
            done()
          })
      })
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
            }
            chai
              .request(server)
              .post("/auth/sign_up")
              .send(newUser)
              .end((err, res) => {
                // should.not.exist(err);
                res.should.have.status(400)
                res.body.should.be.a("object")
                res.body.should.have.property("error")
                res.body.error.should.include(
                  "given username is already registered"
                )
                done()
              })
          })
      })
      it("POST a user", done => {
        let user = {
          email: "passing@mail.com",
          name: "Name: schould pass",
          password: "password"
        }
        chai
          .request(server)
          .post("/auth/sign_up")
          .send(user)
          .end((err, res) => {
            should.not.exist(err)
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have
              .property("message")
              .eql("User successfully signed up")
            res.body.user.should.have.property("token")
            res.body.user.should.have.property("account")
            done()
          })
      })
    })

    describe("POST /auth/log_in", function() {
      it("Returns user infos and token", function(done) {
        var password = "superpassword"
        factory.user({ emailCheckValid: true, password: password }, function(
          validUser
        ) {
          let request = {
            email: validUser.email,
            password: password
          }
          chai
            .request(server)
            .post(`/auth/log_in`)
            .send(request)
            .end(function(err, res) {
              // expect(err).to.be.null;
              // expect(res).to.be.json;
              res.should.have.status(200)
              res.body.should.have
                .property("message")
                .that.include("Login successful")
              res.body.should.have.property("user")
              res.body.user.should.have.property("token")
              done()
            })
        })
      })
      it("Returns Unauthorized when wrong password", function(done) {
        var password = "superpassword"
        factory.user({ emailCheckValid: true, password: password }, function(
          validUser
        ) {
          let request = {
            email: validUser.email,
            password: "wrongpassword"
          }
          chai
            .request(server)
            .post(`/auth/log_in`)
            .send(request)
            .end(function(err, res) {
              // expect(err).to.be.null;
              // expect(res).to.be.json;
              res.should.have.status(401)
              res.body.should.have
                .property("error")
                .that.include("Unauthorized")
              done()
            })
        })
      })
      it("Returns Unauthorized when no user find with email", function(done) {
        var password = "superpassword"
        factory.user({ emailCheckValid: true, password: password }, function(
          validUser
        ) {
          let request = {
            email: "wrong@mail.com",
            password: "superpassword"
          }
          chai
            .request(server)
            .post(`/auth/log_in`)
            .send(request)
            .end(function(err, res) {
              // expect(err).to.be.null;
              // expect(res).to.be.json;
              res.should.have.status(401)
              res.body.should.have
                .property("error")
                .that.include("Unauthorized")
              done()
            })
        })
      })
      it("Asks to confirm email if not validated", function(done) {
        var password = "superpassword"
        factory.user({ emailCheckValid: false, password: password }, function(
          user
        ) {
          let request = {
            email: user.email,
            password: password
          }
          chai
            .request(server)
            .post(`/auth/log_in`)
            .send(request)
            .end(function(err, res) {
              // expect(err).to.be.null;
              // expect(res).to.be.json;
              res.should.have.status(206)
              res.body.should.have
                .property("message")
                .that.include("confirm email")
              done()
            })
        })
      })
    })

    describe("GET /auth/email_check", function() {
      it("Confirms email", function(done) {
        factory.user({ emailCheckValid: false }, function(user) {
          chai
            .request(server)
            .get(
              `/auth/email_check?token=${user.emailCheck.token}&email=${
                user.email
              }`
            )
            .end(function(err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.should.be.a("object")
              res.body.should.have
                .property("message")
                .that.include("Your email has been verified with success")
              done()
            })
        })
      })
      it("Responds an error when called without token", function(done) {
        chai
          .request(server)
          .get("/auth/email_check")
          .end(function(err, res) {
            // expect(err).to.be.null;
            res.should.have.status(400)
            res.should.be.a("object")
            res.text.should.include("No token specified")
            done()
          })
      })
      it("Responds an error when called with invalid token", function(done) {
        chai
          .request(server)
          .get("/auth/email_check?token=unexistingToken&email=email@mail.com")
          .end(function(err, res) {
            // expect(err).to.be.null;
            // expect(res).to.be.json;
            res.should.have.status(400)
            res.should.be.a("object")
            res.text.should.include("Wrong credentials")
            done()
          })
      })
      it("Responds already valid when called on already valid user", function(done) {
        factory.user({ emailCheckValid: true }, function(validUser) {
          chai
            .request(server)
            .get(
              `/auth/email_check?token=${validUser.emailCheck.token}&email=${
                validUser.email
              }`
            )
            .end(function(err, res) {
              // expect(err).to.be.null;
              // expect(res).to.be.json;
              res.should.have.status(206)
              res.should.be.a("object")
              res.body.should.have
                .property("message")
                .that.include("You have already confirmed your email")
              done()
            })
        })
      })
    })
  })

  describe("Recovery of password", function() {
    describe("POST /auth/forgotten_password", function() {
      beforeEach(done => {
        User.remove({}, err => {
          done()
        })
      })
      it("Returns a message if unknowm email", function(done) {
        let body = {
          email: "wrong@mail.com"
        }
        chai
          .request(server)
          .post(`/auth/forgotten_password`)
          .send(body)
          .end(function(err, res) {
            // should.not.exist(err);
            res.should.have.status(400)
            res.should.be.a("object")
            res.body.should.have
              .property("error")
              .that.include(
                "We don't have a user with this email in our dataBase"
              )
            done()
          })
      })
      it("Returns a message if no email provided", function(done) {
        let body = {}
        chai
          .request(server)
          .post(`/auth/forgotten_password`)
          .send(body)
          .end(function(err, res) {
            res.should.have.status(400)
            res.should.be.a("object")
            res.body.should.have
              .property("error")
              .that.include("No email specified")
            done()
          })
      })
      it("Returns a message if email is not confirmed", function(done) {
        factory.user({ emailCheckValid: false }, function(user) {
          let body = {
            email: user.email
          }
          chai
            .request(server)
            .post(`/auth/forgotten_password`)
            .send(body)
            .end(function(err, res) {
              res.should.have.status(400)
              res.should.be.a("object")
              res.body.should.have
                .property("error")
                .that.include("Your email is not confirmed")
              done()
            })
        })
      })
      it("Sends an email to redefine password", function(done) {
        factory.user({ emailCheckValid: true }, function(validUser) {
          let body = {
            email: validUser.email
          }
          chai
            .request(server)
            .post(`/auth/forgotten_password`)
            .send(body)
            .end(function(err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.should.be.a("object")
              res.body.should.have
                .property("message")
                .that.include(
                  "An email has been send with a link to change your password"
                )
              done()
            })
        })
      })
    })

    describe("GET /auth/reset_password", function() {
      const options = {
        validEmailUser: null,
        notValidEmailUser: null,
        outDatedTokenUser: null,
        alreadyUsedLinkUser: null
      }
      const httpVerb = "get"
      // IIFE
      before(createTestUsers(options))
      it("Raise error if no email given", function(done) {
        noEmailGiven(done, httpVerb)
      })
      it("Raise error if no token given", function(done) {
        noTokenGiven(done, httpVerb)
      })
      it("Raise error if email is not in database", function(done) {
        emailNotInDb(done, httpVerb)
      })
      it("Raise error if token doen't match users changing password token", function(done) {
        wrongToken(done, httpVerb, validEmailUser)
      })
      it("Raise error if the change password link has already been used", function(done) {
        linkUsed(done, httpVerb, alreadyUsedLinkUser)
      })
      it("Raise error if user.passwordChange.token is outdated", function(done) {
        tokenOutdated(done, httpVerb, outDatedTokenUser)
      })
      it("Raise error if user has not validated email", function(done) {
        notValidEmail(done, httpVerb, notValidEmailUser)
      })
      it("Authorize Reset password page when user is OK ", function(done) {
        authorizeAccess(done, httpVerb, validEmailUser)
      })
    })

    describe("POST /auth/reset_password", function() {
      const options = {
        validEmailUser: null,
        notValidEmailUser: null,
        outDatedTokenUser: null,
        alreadyUsedLinkUser: null
      }
      const httpVerb = "post"
      before(createTestUsers(options))
      it("Raise error if no email given", function(done) {
        noEmailGiven(done, httpVerb)
      })
      it("Raise error if no token given", function(done) {
        noTokenGiven(done, httpVerb)
      })
      it("Raise error if email is not in database", function(done) {
        emailNotInDb(done, httpVerb)
      })
      it("Raise error if token doen't match users changing password token", function(done) {
        wrongToken(done, httpVerb, validEmailUser)
      })
      it("Raise error if the change password link has already been used", function(done) {
        linkUsed(done, httpVerb, alreadyUsedLinkUser)
      })
      it("Raise error if user.passwordChange.token is outdated", function(done) {
        tokenOutdated(done, httpVerb, outDatedTokenUser)
      })
      it("Raise error if user has not validated email", function(done) {
        notValidEmail(done, httpVerb, notValidEmailUser)
      })
      it("Raise error if no password given", function(done) {
        body = {}
        chai
          .request(server)
          .post(
            `/auth/reset_password?email=${validEmailUser.email}&token=${
              validEmailUser.passwordChange.token
            }`
          )
          .send(body)
          .end(function(err, res) {
            res.should.have.status(400)
            res.should.be.a("object")
            res.body.should.have
              .property("error")
              .that.include("No password provided")
            done()
          })
      })
      it("Raise error if confirmation doesn't match password", function(done) {
        body = {
          newPassword: "newpassword",
          newPasswordConfirmation: "somethingElse"
        }
        chai
          .request(server)
          .post(
            `/auth/reset_password?email=${validEmailUser.email}&token=${
              validEmailUser.passwordChange.token
            }`
          )
          .send(body)
          .end(function(err, res) {
            res.should.have.status(400)
            res.should.be.a("object")
            res.body.should.have
              .property("error")
              .that.include("Password and confirmation are different")
            done()
          })
      })
      it("Changes the password", function(done) {
        body = {
          newPassword: "brandNewPassword",
          newPasswordConfirmation: "brandNewPassword"
        }
        chai
          .request(server)
          .post(
            `/auth/reset_password?email=${validEmailUser.email}&token=${
              validEmailUser.passwordChange.token
            }`
          )
          .send(body)
          .end(function(err, res) {
            should.not.exist(err)
            res.should.be.a("object")
            res.body.should.have
              .property("message")
              .that.include("Password reset successfully")
            done()
          })
      })
    })
  })
})

function createTestUsers(options) {
  return async function() {
    const initialPassword = "old_password"
    try {
      await User.remove({}, err => {})

      validEmailUser = await factory.user({
        email: "validEmail@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: true
      })
      notValidEmailUser = await factory.user({
        email: "notValidEmail@mail.com",
        emailCheckValid: false,
        password: initialPassword,
        passwordChangeValid: true
      })
      alreadyUsedLinkUser = await factory.user({
        email: "alreadyUsedLink@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: false
      })
      let threeHoursAgo = new Date()
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3)
      outDatedTokenUser = await factory.user({
        email: "outDatedToken@mail.com",
        emailCheckValid: true,
        password: initialPassword,
        passwordChangeValid: true,
        passwordChangeCreatedAt: threeHoursAgo
      })
    } catch (e) {
      console.error(e)
    }
  }
}

function noEmailGiven(done, verb, body = {}) {
  let request = chai.request(server)[verb](`/auth/reset_password`)
  if (verb === "post") request = request.send(body)

  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("No email specified")
    done()
  })
}

function noTokenGiven(done, verb, body = {}) {
  let request = chai
    .request(server)
    [verb](`/auth/reset_password?email=hello@mail.com`)
  if (verb === "post") request = request.send(body)

  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("No token specified")
    done()
  })
}

function emailNotInDb(done, verb, body = {}) {
  let request = chai
    .request(server)
    [verb](`/auth/reset_password?email=hello@mail.com&token=some_token`)
  if (verb === "post") request = request.send(body)

  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("Wrong credentials")
    done()
  })
}

function wrongToken(done, verb, validEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/auth/reset_password?email=${validEmailUser.email}&token=some_token`
    )
  if (verb === "post") request = request.send(body)

  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("Wrong credentials")
    done()
  })
}

function linkUsed(done, verb, alreadyUsedLinkUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/auth/reset_password?email=${alreadyUsedLinkUser.email}&token=${
        alreadyUsedLinkUser.passwordChange.token
      }`
    )
  if (verb === "post") request = request.send(body)
  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have
      .property("error")
      .that.include("link has already been used")
    done()
  })
}

function tokenOutdated(done, verb, outDatedTokenUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/auth/reset_password?email=${outDatedTokenUser.email}&token=${
        outDatedTokenUser.passwordChange.token
      }`
    )
  if (verb === "post") request = request.send(body)
  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("Outdated link")
    res.body.should.have.property("message").that.include("link is outdated")
    done()
  })
}

function notValidEmail(done, verb, notValidEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/auth/reset_password?email=${notValidEmailUser.email}&token=${
        notValidEmailUser.passwordChange.token
      }`
    )
  if (verb === "post") request = request.send(body)
  request.end(function(err, res) {
    res.should.have.status(401)
    res.should.be.a("object")
    res.body.should.have.property("error").that.include("Email not confirmed")
    res.body.should.have
      .property("message")
      .that.include("validate your email first")
    done()
  })
}

function authorizeAccess(done, verb, validEmailUser, body = {}) {
  let request = chai
    .request(server)
    [verb](
      `/auth/reset_password?email=${validEmailUser.email}&token=${
        validEmailUser.passwordChange.token
      }`
    )
  if (verb === "post") request = request.send(body)
  request.end(function(err, res) {
    should.not.exist(err)
    res.should.be.a("object")
    res.body.should.have
      .property("message")
      .that.include("Ready to recieve new password")
    done()
  })
}

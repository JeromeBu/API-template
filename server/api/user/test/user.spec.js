let server = require("../../../../index")

var User = require("../../user/model")
var factory = require("../../../utils/modelFactory")

var chai = require("chai")
var expect = require("chai").expect
var should = require("chai").should()
var chaiHttp = require("chai-http")
chai.use(chaiHttp)

describe("GET testing secured route users/:id", function() {
  beforeEach(done => {
    User.remove({}, err => {
      done()
    })
  })
  it("Check autentification before giving access", function(done) {
    factory.user({}, function(user) {
      chai
        .request(server)
        .get(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .set("Content-Type", "application/json")
        .end(function(err, res) {
          // console.log(err)
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.a("object")
          res.body.should.have.property("account")
          res.body.account.should.have.property("description")
          done()
        })
    })
  })
})

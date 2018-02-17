require("dotenv").config();
var config = require("../config");

var chai = require("chai");
var expect = require("chai").expect;
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

const url = "http://localhost:" + config.PORT;

describe("GET /api/user/emailCheck", function() {
  // it("respond with a message confirming email has been validated", function(done) {
  //   chai
  //     .request(url)
  //     .get("/api/user/emailCheck")
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.be.json;
  //       expect(res).to.have.status(200);
  //       expect(res.body)
  //         .to.have.property("message")
  //         .to.deep.include({
  //           message: "Your email has been verified with success"
  //         });
  //       done();
  //     });
  // });

  it("respond an error when called without token", function(done) {
    chai
      .request(url)
      .get("/api/user/emailCheck")
      .end(function(err, res) {
        // expect(err).to.be.null;
        // expect(res).to.be.json;
        expect(res).to.have.status(400);
        expect(res.text).to.equal("No token specified");
        done();
      });
  });

  it("respond an error when called with invalid token", function(done) {
    chai
      .request(url)
      .get("/api/user/emailCheck?token=unexistingToken")
      .end(function(err, res) {
        // expect(err).to.be.null;
        // expect(res).to.be.json;
        expect(res).to.have.status(400);
        expect(res.text).to.equal("Invalid token");
        done();
      });
  });
});

// describe("GET /api/user/emailCheck", function() {
//   it("respond respond already valid when called on already valid user", function(done) {
//     chai
//       .request(url)
//       .get("/api/user/emailCheck?token=unexistingToken")
//       .end(function(err, res) {
//         // expect(err).to.be.null;
//         // expect(res).to.be.json;
//         expect(res).to.have.status(400);
//         expect(res.text).to.equal("Invalid token");
//         done();
//       });
//   });
// });

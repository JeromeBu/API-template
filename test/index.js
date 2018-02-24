require("dotenv").config();

let server = require("../server");

var chai = require("chai");
var expect = require("chai").expect;
var should = require("chai").should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("Home", function() {
  after(function() {
    server.close();
  });

  describe("GET /", function() {
    it("respond with welcome message", function(done) {
      chai
        .request(server)
        .get("/")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.text.should.equal("Welcome to the Airbnb API.");
          done();
        });
    });
  });

  describe("GET /api/home", function() {
    it("respond with cities and featured", function(done) {
      chai
        .request(server)
        .get("/api/home")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.be.json;
          res.should.to.have.status(200);
          expect(res.body)
            .to.have.property("cities")
            .to.be.a("array");
          res.body.should.have.property("featured").be.a("array");
          done();
        });
    });
  });
});

let server = require("../server");
describe("Closing connections", function() {
  it("Closes all connections", function(done) {
    server.close();
    server.mongooseDisconnect(); // Needed in order to stop mocha from running
    done();
  });
});

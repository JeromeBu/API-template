const server = require("../../index")
const { mongooseDisconnect } = require("../server")

describe("Closing connections", function() {
  it("Closes all connections", function(done) {
    server.close()
    mongooseDisconnect() // Needed in order to stop mocha from running
    done()
  })
})

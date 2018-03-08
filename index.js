const app = require("./server/server").app;
const config = require("./config");

const server = app.listen(config.PORT, function() {
  console.log(
    `API running on port ${
      config.PORT
    } | ${config.ENV.toUpperCase()} environement | MONGO_URI: ${
      config.MONGODB_URI
    } \n`
  );
});

module.exports = server; // for testing

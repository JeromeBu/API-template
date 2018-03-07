var config = require("./config");

var mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI, function(err) {
  if (err) console.error("Could not connect to mongodb.");
});

var express = require("express");
var app = express();

var morgan = require("morgan"); // in order to log requests
//we don't want it in test mode as it interfers with terminal display of test results
if (config.ENV !== "test") {
  app.use(morgan("dev"));
}

var helmet = require("helmet"); // protection package
app.use(helmet());

var compression = require("compression"); // compress server responses in GZIP
app.use(compression());

var bodyParser = require("body-parser"); // to parse POST requests
app.use(bodyParser.json());

var User = require("./models/User");
var Room = require("./models/Room");
var City = require("./models/City");

var passport = require("passport");
app.use(passport.initialize()); // TODO test

const { errorHandler } = require("./middlewares/errorHandler");
// Local for login + password
var LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
      session: false
    },
    User.authenticateLocal()
  )
);

// authorization bearer
const HTTPBearerStrategy = require("passport-http-bearer").Strategy;
passport.use(new HTTPBearerStrategy(User.authenticateBearer())); // La méthode `authenticateBearer` a été déclarée dans le model User

app.get("/", function(req, res) {
  res.send("Welcome to the Airbnb API.");
});

const cors = require("cors"); // to authorize request to the API from another domaine
app.use("/api", cors());

const coreRoutes = require("./routes/core.js");
const userRoutes = require("./routes/user.js");
const roomRoutes = require("./routes/room.js");

app.use("/api", coreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

// Error 404 for all verbs (GET, POST, etc.) when page not found.
app.all("*", function(req, res) {
  res.status(404).json({ status: 404, error: "Not Found" });
});

// Error handling middleware
// This middleware is call with next(err_msg) within a route
app.use(errorHandler);

const server = app.listen(config.PORT, function() {
  console.log(
    `API running on port ${
      config.PORT
    } | ${config.ENV.toUpperCase()} environement | MONGO_URI: ${
      config.MONGODB_URI
    } \n`
  );
});

function mongooseDisconnect() {
  mongoose.connection.close();
}

module.exports = server; // for testing
module.exports.mongooseDisconnect = mongooseDisconnect;

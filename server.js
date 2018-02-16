require("dotenv").config(); // allows to define env varibles in .env file
var config = require("./config");

var mongoose = require("mongoose");

mongoose.connect(config.MONGODB_URI, function(err) {
  if (err) console.error("Could not connect to mongodb.");
});

var express = require("express");
var app = express();

var morgan = require("morgan"); // in order to log requests
//we don't want it in test mode has it interfer with terminal display of test results
if (config.ENV !== "test") {
  app.use(morgan("combined"));
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

// Nous aurons besoin de 2 strategies :
// - `local` permettra de gérer le login nécessitant un mot de passe
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

// - `http-bearer` permettra de gérer toute les requêtes authentifiées à l'aide d'un `token`
var HTTPBearerStrategy = require("passport-http-bearer").Strategy;
passport.use(new HTTPBearerStrategy(User.authenticateBearer())); // La méthode `authenticateBearer` a été déclarée dans le model User

app.get("/", function(req, res) {
  res.send("Welcome to the Airbnb API.");
});

var cors = require("cors"); // to authorize request to the API from another domaine
app.use("/api", cors());

// Les routes sont séparées dans plusieurs fichiers
var coreRoutes = require("./routes/core.js");
var userRoutes = require("./routes/user.js");
var roomRoutes = require("./routes/room.js");
// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use("/api", coreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront une erreur 404
app.all("*", function(req, res) {
  res.status(404).json({ status: 404, error: "Not Found" });
});

// Le dernier middleware de la chaîne gérera les d'erreurs
// Ce `error handler` doit définir obligatoirement 4 paramètres
// Définition d'un middleware : https://expressjs.com/en/guide/writing-middleware.html
app.use(function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  if (config.ENV === "production") err = "An error occurred";
  res.json({ error: err });
});

app.listen(config.PORT, function() {
  console.log(`API running on port ${config.PORT} en env: ${config.ENV}`);
});

// TODO test
// console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);

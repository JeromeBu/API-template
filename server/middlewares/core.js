const passport = require("passport");

const _errorHandler = function(err, req, res) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  if (config.ENV === "production") err = "An error occurred";
  res.json({ error: err });
};
exports.errorHandler = _errorHandler;

exports.checkLoggedIn = function(req, res, next) {
  passport.authenticate("bearer", { session: false }, function(
    err,
    user,
    info
  ) {
    if (err) {
      res.status(400);
      return _errorHandler(err.message);
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.current_user = user;
    next();
  })(req, res, next);
};

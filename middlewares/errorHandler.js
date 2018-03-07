exports.errorHandler = function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  if (config.ENV === "production") err = "An error occurred";
  res.json({ error: err });
};

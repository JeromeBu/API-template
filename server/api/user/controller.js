const config = require("../../../config")
const User = require("./model")
const uid2 = require("uid2")
const passport = require("passport")
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})
const confirmEmail = require("../../emails/confirmationEmail")
const forgetPasswordEmail = require("../../emails/forgetPasswordEmail")

// Display list of all Genre.

exports.initial_get_user = function(req, res, next) {
  const { currentUser } = req
  User.findById(req.params.id)
    .select("account")
    // .populate("account")
    .exec()
    .then(function(user) {
      if (!user) {
        res.status(404)
        return next("User not found")
      }
      return res.json({
        _id: user._id,
        account: user.account
      })
    })
    .catch(function(err) {
      console.error(err.message)
      res.status(400)
      return next(err.message)
    })
}

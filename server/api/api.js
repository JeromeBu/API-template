const router = require("express").Router()

router.use("/users", require("./user/routes.js"))

module.exports = router

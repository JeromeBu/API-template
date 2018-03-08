const router = require("express").Router();

router.use("/auth", require("./auth/routes.js"));
router.use("/users", require("./user/routes.js"));

module.exports = router;

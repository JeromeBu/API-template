const config = require("../../../config");
const express = require("express");
const router = express.Router();
const { handleResetPasswordErrors } = require("../../middlewares/user");
const { checkLoggedIn } = require("../../middlewares/core");
const user_controller = require("../user/controller");

// L'authentification est obligatoire pour cette route
router.get("/:id", checkLoggedIn, user_controller.initial_get_user);

module.exports = router;

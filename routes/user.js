const config = require("../config");
const express = require("express");
const router = express.Router();
const { handleResetPasswordErrors } = require("../middlewares/user");
const user_controller = require("../controllers/userController");

router.post("/sign_up", user_controller.sign_up);

router.post("/log_in", user_controller.log_in);

router.route("/email_check").get(user_controller.email_check);

router.route("/forgotten_password").post(user_controller.forgotten_password);
router
  // const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
  .route("/reset_password")
  .get(handleResetPasswordErrors({}), user_controller.reset_password_GET)
  .post(handleResetPasswordErrors({}), user_controller.reset_password_POST);

// L'authentification est obligatoire pour cette route
router.get("/:id", user_controller.initial_get_user);

module.exports = router;

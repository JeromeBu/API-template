const router = require("express").Router();

router.use("/users", require("./user/routes.js"));

// const userRoutes = require("../routes/user.js");
// const roomRoutes = require("./routes/room.js");

// app.use("/api", coreRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/room", roomRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();

// authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

//user controllers
const {
  register,
  login,
  checkUser,
  getCounts,
  SingleUser,
  update,
} = require("../controller/userController");
// register route
router.post("/register", register);
// login user
router.post("/login", login);

router.get("/check", authMiddleware, checkUser);

router.get("/count", getCounts);

//single users
router.get("/userdata/:userid", SingleUser);
// check user

router.put("/update/:userid", update);

module.exports = router;

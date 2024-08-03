const express = require("express");
const router = express.Router();

//question controllers
const {
  postQuestion,
  allQuestion,
  singleQuestion,
} = require("../controller/questionController");

// postQuestion route
router.post("", postQuestion);

// allQuestion user
router.get("", allQuestion);

// check user
router.post("/:questionid", singleQuestion);

module.exports = router;

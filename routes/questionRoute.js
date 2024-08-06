const express = require("express");
const router = express.Router();

//question controllers
const {
  postQuestion,
  allQuestion,
  singleQuestion,
  SearchByTitle,
} = require("../controller/questionController");

// postQuestion route
router.post("", postQuestion);

// allQuestion user
router.get("", allQuestion);

// check user
router.post("/:questionid", singleQuestion);

//search using Title
router.get("/search/:title", SearchByTitle);

module.exports = router;

const express = require("express");
const router = express.Router();

//question controllers
const {
  postQuestion,
  allQuestion,
  singleQuestion,
  SearchByTitle,
  usersQuestions,
  DeleteQuestion,
} = require("../controller/questionController");

// postQuestion route
router.post("", postQuestion);

// allQuestion user
router.get("", allQuestion);

// check user
router.post("/:questionid", singleQuestion);

router.get("/userquestion/:userid", usersQuestions);

//search using Title
router.get("/search/:title", SearchByTitle);

router.delete("/delete/:userid", DeleteQuestion);

module.exports = router;

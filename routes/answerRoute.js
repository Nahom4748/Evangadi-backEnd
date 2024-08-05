const express = require("express");
const router = express.Router();

//user controllers
const {
  postAnswer,
  getAnswer,
  deleteAnswersByUser,
} = require("../controller/answerController");

// get answer
router.get("/Answers/:questionid", getAnswer);

// post answer
router.post("", postAnswer);

router.delete("/delete/:userid", deleteAnswersByUser);

module.exports = router;

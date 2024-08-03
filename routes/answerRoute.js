const express = require("express");
const router = express.Router();

//user controllers
const { postAnswer, getAnswer } = require("../controller/answerController");

// get answer
router.get("/Answers", getAnswer);

// post answer
router.post("", postAnswer);

module.exports = router;

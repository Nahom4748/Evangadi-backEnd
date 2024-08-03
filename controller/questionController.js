const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
// we use crypto to generate unique questionid
const crypto = require("crypto");

// Function to generate a unique alphanumeric string
function generateUniqueId() {
  return crypto.randomBytes(16).toString("hex"); // Generates a unique 32-character hexadecimal string
}

async function postQuestion(req, res) {
  const { title, description } = req.body;
  const userid = req.user.userid; //  userid is provided by middleware

  // Check for missing fields
  if (!title || !description || !userid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all required fields",
    });
  }

  // Generate a unique questionid
  const questionid = generateUniqueId();

  try {
    // Insert the new question into the database
    await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, userid, title, description]
    );

    // Respond with success
    return res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully",
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, try again later!",
    });
  }
}

// async function allQuestion(req, res) {
//   try {
//     // we don't request body for questions, simply we fetch and return all questions from the database.
//     const [questionsRow] = await dbConnection.query(
//       "SELECT  q.questionid, q.title, q.description, q.userid, q.created_at, u.username,u.firstname FROM questions AS q JOIN users AS u ON q.userid = u.userid"
//     );

//     // Check if any questions is avalable
//     if (questionsRow.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ msg: "No questions found." });
//     }

//     const [questionList] = questionsRow;
//     const { questionid, title, description, username, created_at, firstname } =
//       questionList;

//     return res.status(StatusCodes.OK).json({
//       title,
//       description,
//       username,
//       created_at,
//     });
//   } catch (error) {
//     console.error("Error details:", error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }
async function allQuestion(req, res) {
  try {
    // Fetch all questions with user details from the database
    const [questionsRow] = await dbConnection.query(
      `SELECT 
        q.questionid, q.title, q.description, q.userid, q.created_at, 
        u.username, u.firstname, u.lastname 
      FROM questions AS q 
      JOIN users AS u ON q.userid = u.userid`
    );

    // Check if any questions are available
    if (questionsRow.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found." });
    }

    return res.status(StatusCodes.OK).json(questionsRow);
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

async function singleQuestion(req, res) {
  const { questionid } = req.body; // Access the path parameter

  try {
    const [questions] = await dbconnection.query(
      "SELECT questions.questionid, questions.title, questions.description AS content, users.username, questions.createdat FROM questions INNER JOIN users ON users.userid = questions.userid WHERE questionid = ? ",
      [questionid]
    );

    // Check if the question was found
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    // Return the single question
    return res.status(StatusCodes.OK).json({ questions: questions[0] });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postQuestion, allQuestion, singleQuestion };

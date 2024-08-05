const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Insert the new answer into the database
    const [result] = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [req.user.userid, questionid, answer]
    );
    // Respond with success
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getAnswer(req, res) {
  const questionid = req.params.questionid;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
        q.questionid, q.answer, q.answerid, q.userid, q.created_at, 
        u.username, u.firstname, u.lastname 
      FROM answers AS q 
      JOIN users AS u ON q.userid = u.userid 
      WHERE q.questionid = ?`,
      [questionid]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

async function deleteAnswersByUser(req, res) {
  const { userid } = req.params;
  const { questionid } = req.body;
  console.log(questionid);
  // Check for missing userid
  if (!userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "User ID is required" });
  }

  try {
    // Delete the answers by userid
    const [result] = await dbConnection.query(
      "DELETE FROM answers WHERE userid = ? AND questionid = ?",
      [userid, questionid]
    );

    // Check if any answers were deleted
    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for the given user" });
    }

    // Respond with success message
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answers deleted successfully" });
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = { postAnswer, getAnswer, deleteAnswersByUser };

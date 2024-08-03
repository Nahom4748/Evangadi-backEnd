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
  // const questionid = req.params.questionid;

  // // Check for missing questionid
  // if (!questionid) {
  //   return res
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ msg: "Please enter all required fields" });
  // }

  try {
    // selecting data by the questionid
    // const [rows] = await dbConnection.query(
    //   "SELECT questionid, answerid, answer, userid, created_at FROM answers WHERE questionid = ?",
    //   [questionid]
    // );

    const [rows] = await dbConnection.query(
      `SELECT 
    q.questionid, q.answer, q.answerid, q.userid, q.created_at, 
    u.username, u.firstname, u.lastname 
  FROM answers AS q 
  JOIN users AS u ON q.userid = u.userid`
    );
    return res.status(200).json(rows);

    // // Check if asnwer was found
    // if (rows.length === 0) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ msg: "Answer not found" });
    // }

    // Destructure the first row from the results
    const [answers] = rows;
    const { answerid, answer, userid, created_at } = answers;

    // Respond with success and include answer details
    // return res.status(StatusCodes.OK).json({
    //   questionid,
    //   answerid,
    //   answer,
    //   userid,
    //   created_at,
    // });
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = { postAnswer, getAnswer };

const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
async function getCounts(req, res) {
  try {
    const [result] = await dbConnection.query(`
        SELECT 
            (SELECT COUNT(*) FROM users) AS user_count, 
            (SELECT COUNT(*) FROM questions) AS question_count
      `);

    const userCount = result[0].user_count;
    const questionCount = result[0].question_count;

    res.status(200).json({ userCount, questionCount });
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    res.StatusCodes.json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = { getCounts };

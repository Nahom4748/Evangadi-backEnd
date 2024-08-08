//db connection
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "select username,userid from users where username = ? or email =? ",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname,lastname,email, password) VALUES (?,?,?,?,?) ",
      [username, firstname, lastname, email, hashedpassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "select username,userid,password from users where email =  ? ",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential" });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential" });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User login successful", token, username });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

async function SingleUser(req, res) {
  const userid = req.params.userid; // Use req.params to extract userid from URL parameters

  // Check for missing userid
  if (!userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }

  try {
    // Selecting data by the userid
    const [rows] = await dbConnection.query(
      "SELECT * FROM users WHERE userid = ?",
      [userid] // Use parameterized query to prevent SQL injection
    );

    // Check if user was found
    if (rows.length == 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    // Destructuring the data to see the output we need
    const [user] = rows;
    const { username, firstname, lastname, email, password } = user;
    // Respond with success and include user details
    return res.status(StatusCodes.OK).json({
      username,
      firstname,
      lastname,
      email,
      password,
    });
  } catch (error) {
    console.error("Error details:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(StatusCodes.OK).json({ msg: "Valid user", username, userid });
}

async function getCounts(req, res) {
  try {
    const [result] = await dbConnection.query(`
        SELECT
            (SELECT COUNT(*) FROM users) AS user_count,
            (SELECT COUNT(*) FROM questions) AS question_count,
            (SELECT COUNT(*) FROM answers ) AS answers_count
            `);

    const userCount = result[0].user_count;
    const questionCount = result[0].question_count;
    const answersCount = result[0].answers_count;

    res.status(200).json({ userCount, questionCount, answersCount });
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    res.StatusCodes.json({ msg: "Something went wrong, try again later!" });
  }
}

async function update(req, res) {
  const userid = req.params.userid;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  try {
    await dbConnection.query(
      "UPDATE users SET `firstname`=?, `lastname`=?, `email`=? WHERE userid=?",
      [firstname, lastname, email, userid]
    );

    return res.status(StatusCodes.OK).json({ msg: "Updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.CONFLICT).json({ msg: "Oops! Error" });
  }
}

module.exports = { register, login, SingleUser, checkUser, getCounts, update };

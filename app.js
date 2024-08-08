require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");
const port = 5500;

//cors
app.use(cors());

//db connection
const dbConnection = require("./db/dbConfig");

//user routes middleware file
const userRoutes = require("./routes/userRoute");
//question routes middleware file
const questioinRoutes = require("./routes/questionRoute");

//asnswer routes middleware file
const answerRoutes = require("./routes/answerRoute");

const Count = require("./routes/CountData");
//authonthication middleware
const authMiddleware = require("./middleware/authMiddleware");

// json middleware to extract json data
app.use(express.json());

// user routes middleware
app.use("/api/users", userRoutes);

// questioins routes middleware
app.use("/api/questions", authMiddleware, questioinRoutes);

// answers routes middleware ??
app.use("/api/answers", authMiddleware, answerRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();

const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.host,
  password: process.env.PASSWORD,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();

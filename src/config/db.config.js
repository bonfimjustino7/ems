const mysql = require("mysql");

const dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "loja",
});

dbConn.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});

module.exports = dbConn;

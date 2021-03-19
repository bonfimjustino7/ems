const mysql = require("mysql");
const fs = require("fs");

const path = require("path");

const dataSql = fs
  .readFileSync(`${path.join(__dirname, "../database/tables.sql")}`)
  .toString();

const dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "loja",
  multipleStatements: true,
});

dbConn.connect((err) => {
  if (err) {
    return console.log(err);
  }

  dbConn.query(dataSql, (err, results, fields) => {
    if (err) {
      console.log(err.message);
    }
  });
  console.log("Database connected");
});

module.exports = dbConn;

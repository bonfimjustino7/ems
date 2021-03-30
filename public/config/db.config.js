const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const doenv = require("dotenv");

doenv.config();

const dataSql = fs
  .readFileSync(`${path.join(__dirname, "../database/tables.sql")}`)
  .toString();

const dbConn = mysql.createConnection({
  host: "localhost",
  user: process.env.user,
  password: process.env.pass,
  database: process.env.db,
  multipleStatements: true,
});

const conectar = () => {
  return new Promise((resolve, reject) => {
    dbConn.connect((err) => {
      if (err) {
        reject(err);
        throw Error(err);
      }

      dbConn.query(dataSql, (err, results, fields) => {
        if (err) {
          console.log(err.message);
        }
      });
      resolve("Database connected");
    });
  });
};

exports.conectar = conectar;
exports.getConexao = dbConn;

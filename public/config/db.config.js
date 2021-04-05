const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const dataSql = fs
  .readFileSync(`${path.join(__dirname, "../database/tables.sql")}`)
  .toString();

const dbConn = mysql.createConnection({
  host: "localhost",
  user: process.env.USER_MYSQL,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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

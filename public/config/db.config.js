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

const conectar = () => {
  return new Promise((resolve, reject) => {
    dbConn.connect((err) => {
      if (err) {
        reject(err);
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

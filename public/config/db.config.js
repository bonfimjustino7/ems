// const { dialog } = require("electron");
const mysql = require("mysql");

const dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "loja",
  multipleStatements: true,
});

dbConn.connect((err) => {
  if (err) {
    // dialog.showErrorBox(
    //   "Error",
    //   "Não foi possivel estabelecer uma conexão com o banco de dados."
    // );
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

module.exports = dbConn;

const dbConfig = require("../config/db.config");
const fs = require("fs");

const dataSql = fs.readFileSync("./tables.sql").toString();

function createTables() {
  return new Promise((resolve, reject) => {
    dbConfig.query(dataSql, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

createTables();

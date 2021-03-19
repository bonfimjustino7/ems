const dbConn = require("../config/db.config");

exports.table = null;
exports.create = function (user) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `INSERT INTO ${exports.table} set ?`,
      user,
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};
exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `SELECT * FROM ${exports.table} where id = ? `,
      id,
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.filter = function (filters, limit) {
  let params = Object.keys(filters).map((key) => {
    return `${key} = '${filters[key]}'`;
  });

  params = params.join(" AND ");

  let queryStr;
  if (limit) {
    queryStr = `SELECT * FROM ${exports.table} WHERE ${params} LIMIT ${limit}`;
  } else {
    queryStr = `SELECT * FROM ${exports.table} WHERE ${params}`;
  }
  return new Promise((resolve, reject) => {
    dbConn.query(queryStr, function (err, res) {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.findAll = function () {
  return new Promise((resolve, reject) => {
    dbConn.query(`SELECT * FROM ${exports.table}`, function (err, res) {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.update = function (id, user) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `UPDATE ${exports.table} SET ? WHERE id = ?`,
      [user, id],
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};
exports.delete = function (id) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `DELETE FROM ${exports.table} WHERE id = ?`,
      [id],
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

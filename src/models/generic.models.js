const dbConn = require("../config/db.config");

exports.table = null;
exports.create = function (newEmp, result) {
  dbConn.query(
    `INSERT INTO ${exports.table} set ?`,
    newEmp,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
exports.findById = function (id, result) {
  dbConn.query(
    `SELECT * FROM ${exports.table} where id = ? `,
    id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

exports.filter = function (filters, result) {
  dbConn.query(
    `SELECT * FROM ${exports.table} WHERE ?`,
    filters,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

exports.findAll = function (result) {
  dbConn.query(`SELECT * FROM ${exports.table}`, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      // console.log("Users : ", res);
      result(null, res);
    }
  });
};
exports.update = function (id, user, result) {
  dbConn.query(
    `UPDATE ${exports.table} SET ? WHERE id = ?`,
    [user, id],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
exports.delete = function (id, result) {
  dbConn.query(
    `DELETE FROM ${exports.table} WHERE id = ?`,
    [id],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

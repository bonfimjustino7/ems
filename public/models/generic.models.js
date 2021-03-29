const { getConexao } = require("../config/db.config");

class Consultas {
  constructor(table) {
    this.table_name = table;
  }

  create() {
    return new Promise((resolve, reject) => {
      getConexao.query(
        `INSERT INTO ${this.table_name} set ?`,
        this,
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
  }
  findById(id) {
    return new Promise((resolve, reject) => {
      getConexao.query(
        `SELECT * FROM ${this.table_name} where id = ? `,
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
  }

  filter(filters, limit = 1) {
    if (Object.keys(filters).length) {
      let params = Object.keys(filters).map((key) => {
        const valor = getConexao.escape(filters[key]);

        return `${key} = ${valor}`;
      });

      params = params.join(" AND ");

      let queryStr;
      if (limit) {
        queryStr = `SELECT * FROM ${this.table_name} WHERE ${params} LIMIT ${limit}`;
      } else {
        queryStr = `SELECT * FROM ${this.table_name} WHERE ${params}`;
      }

      return new Promise((resolve, reject) => {
        getConexao.query(queryStr, function (err, res) {
          if (err) {
            console.log("error: ", err);
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    } else {
      return this.findAll();
    }
  }

  findAll() {
    return new Promise((resolve, reject) => {
      getConexao.query(`SELECT * FROM ${this.table_name}`, function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  update(id) {
    return new Promise((resolve, reject) => {
      getConexao.query(
        `UPDATE ${this.table_name} SET ? WHERE id = ?`,
        [this, id],
        function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      getConexao.query(
        `DELETE FROM ${this.table_name} WHERE id = ?`,
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
  }
}
module.exports = Consultas;

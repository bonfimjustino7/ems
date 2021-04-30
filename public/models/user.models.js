const Consultas = require("./generic.models");
const { cryptHash } = require("../utils/crypt");
const { getConexao } = require("../config/db.config");

class User extends Consultas {
  constructor(user) {
    super("usuario");

    this.login = user.login;
    this.password = user.password;
    this.nome = user.nome;
    this.email = user.email;
    this.sobrenome = user.sobrenome;
    this.cpf = user.cpf;
    this.telefone = user.telefone;
    this.tipoconta = user.tipoconta;
    this.gerente = user.gerente;
  }

  async createUser() {
    try {
      if (this.password) {
        this.password = cryptHash(this.password);
        await this.create();
      } else {
        throw new Error("A senha é obrigatória");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(id) {
    try {
      if (this.password) {
        this.password = cryptHash(this.password);
        await this.update(id);
      } else {
        throw new Error("A senha é obrigatória");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatePassword(id) {
    const password = cryptHash(this.password);
    const query = `UPDATE ${this.table_name} SET password = '${password}' WHERE id = ${id}`;
    console.log(query);
    try {
      const res = await this.execute(query);

      if (res) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  filter(filters, limit) {
    let params = Object.keys(filters)
      .filter((key) => filters[key].length)
      .map((key) => {
        let valor = filters[key];
        let clause = "";
        if (key === "tipo" && filters[key].length) {
          const tipos = getConexao.escape(valor);
          clause = `${key} in (${tipos})`;
        } else {
          clause = `${key} LIKE '${valor}%'`;
        }
        return clause;
      });

    params = params.join(" AND ");
    const queryStr = `SELECT * FROM ${this.table_name} WHERE ${params} ${
      limit ? "LIMIT " + limit : ""
    }`;

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
  }

  async getPedidos(id = null) {
    let sql = `SELECT pedido.id as id, usuario.nome as usuario, produto.nome as produto, pedido.data, pedido.quantidade, produto.preco FROM pedido JOIN produto ON produto.id = pedido.produto_id JOIN usuario ON usuario.id = pedido.usuario_id WHERE status = 'FINALIZED'`;

    if (id) {
      // caso seja as compras de um usuario
      sql += `AND usuario_id = ${id}`;
    }
    try {
      return await this.execute(sql);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = User;

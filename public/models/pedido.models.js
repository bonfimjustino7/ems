const { getConexao } = require("../config/db.config");
const { ToJson } = require("../utils/sql");
const Consultas = require("./generic.models");

class Pedido extends Consultas {
  constructor(pedido) {
    super("pedido");
    this.usuario_id = pedido.usuario_id;
    this.produto_id = pedido.produto_id;
    this.quantidade = pedido.quantidade;
    this.total = pedido.total;
  }

  getProductsUser(usuario_id) {
    const queryStr = `SELECT pedido.id as pedido_id, produto.nome, pedido.quantidade, produto.preco, produto.usuario FROM pedido JOIN produto ON pedido.produto_id = produto.id WHERE pedido.usuario_id = ${usuario_id} AND pedido.status ='IN PROGRESS'`;

    return new Promise((resolve, reject) => {
      getConexao.query(queryStr, function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(ToJson(res));
        }
      });
    });
  }

  finalizarPedido(usuario_id) {
    const queryStr = `UPDATE pedido SET pedido.status = 'FINALIZED' WHERE usuario_id = ${usuario_id}`;

    return new Promise((resolve, reject) => {
      getConexao.query(queryStr, function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(ToJson(res));
        }
      });
    });
  }

  atualizarQuantidade(pedido_id, novaQuantidade) {
    const queryStr = `UPDATE pedido SET pedido.quantidade = ${novaQuantidade} WHERE id= ${pedido_id}`;

    return new Promise((resolve, reject) => {
      getConexao.query(queryStr, function (err, res) {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(ToJson(res));
        }
      });
    });
  }
}

module.exports = Pedido;

const { getConexao } = require("../config/db.config");
const Consultas = require("./generic.models");

class Produto extends Consultas {
  constructor(produto) {
    super("produto");

    this.nome = produto.nome;
    this.marca = produto.marca;
    this.preco = produto.preco;
    this.codigo_barras = produto.codigo_barras;
    this.quantidade = produto.quantidade;
    this.tamanho = produto.tamanho;
    this.descricao = produto.descricao;
    this.tipo = produto.tipo;
    this.usuario = produto.usuario;
    this.imagem = produto.imagem;
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
}
module.exports = Produto;

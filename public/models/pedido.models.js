const Consultas = require("./generic.models");

class Pedido extends Consultas {
  constructor(pedido) {
    super("pedido");
    this.usuario_id = pedido.usuario_id;
    this.produto_id = pedido.produto_id;
    this.quantidade = pedido.quantidade;
  }
}

module.exports = Pedido;

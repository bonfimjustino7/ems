const Pedido = require("../models/pedido.models");
const Produto = require("../models/product.models");

exports.savePedido = async function ({ usuario_id, produto_id }) {
  try {
    const pedidoObject = new Pedido({ usuario_id, produto_id });
    const pedidoQuerySet = await pedidoObject.filter({
      usuario_id,
      produto_id,
    });

    if (pedidoQuerySet.length) {
      pedidoObject.quantidade = pedidoQuerySet[0].quantidade + 1;
      await pedidoObject.update(pedidoQuerySet[0].id);
      return true;
    } else {
      pedidoObject.quantidade = 1;
      await pedidoObject.create();
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getPedidos = async function ({ usuario_id }) {
  try {
    // const pedidos = await new Pedido({}).filter({
    //   usuario_id,
    //   produto_id,
    // });
    const pedidos = await new Pedido({}).getProductsUser(usuario_id);
    const pedidosTotais = pedidos.map((pedido) => {
      return { ...pedido, valor: pedido.preco * pedido.quantidade };
    });
    return pedidosTotais;
  } catch (error) {
    console.log(error);
    return [];
  }
};

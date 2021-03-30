const Pedido = require("../models/pedido.models");
const Produto = require("../models/product.models");

exports.savePedido = async function ({ usuario_id, produto_id }) {
  try {
    const pedidoObject = new Pedido({ usuario_id, produto_id });
    const pedidoQuerySet = await pedidoObject.filter({
      usuario_id,
      produto_id,
      status: "IN PROGRESS",
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
exports.finalizarPedidos = async function ({ usuario_id }) {
  try {
    await new Pedido({}).finalizarPedido(usuario_id);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.atualizarPedido = async function ({ pedido_id, quantidade }) {
  try {
    await new Pedido({}).atualizarQuantidade(pedido_id, quantidade);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.removerPedido = async function ({ pedido_id }) {
  try {
    await new Pedido({}).delete(pedido_id);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

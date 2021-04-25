const Produto = require("../models/product.models");

exports.getProdutos = async function (filters, limit) {
  try {
    let res;
    if (filters?.tipo?.length || filters?.nome?.length) {
      res = await new Produto({}).filter(filters, limit);
    } else {
      res = await new Produto({}).findAll(limit);
    }
    const produtos = JSON.parse(JSON.stringify(res));
    if (produtos.length) {
      return produtos;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.saveProduto = async function (data) {
  try {
    await new Produto(data).create();

    return true;
  } catch (error) {
    return false;
  }
};

exports.deleteProduto = async function (data) {
  try {
    const { idProduto } = data;
    await new Produto({}).delete(idProduto);
    console.log(idProduto);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

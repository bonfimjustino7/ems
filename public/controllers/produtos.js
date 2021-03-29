const Produto = require("../models/product.models");

exports.getProdutos = async function (filters) {
  try {
    let res;
    if (filters.tipo.length || filters.nome.length) {
      res = await new Produto({}).filter(filters);
    } else {
      res = await new Produto({}).findAll();
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

// const Produto = require("../models/product.models");
const Produto = require("../models/product.models");
const User = require("../models/user.models");
const { xmlToJson } = require("../utils/json");
const Store = require("electron-store");

const store = new Store();

const generateMock = () => {
  if (!(store.get("user_mock") && store.get("product_mock"))) {
    console.log("Gerando dados mockados");
    try {
      const userJson = xmlToJson("../data/users.xml");
      const produtosJson = xmlToJson("../data/products.xml");

      if (
        Object.keys(userJson.users).length &&
        Object.keys(produtosJson.products).length
      ) {
        const usuario = userJson.users.user;
        new User(usuario).create();
        store.set("user_mock", "true");

        const produtos = produtosJson.products.product;
        produtos.forEach(async (produto) => {
          await new Produto(produto).create();
        });
        store.set("product_mock", true);
      } else {
        console.log("Problemas no xml usuarios");
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }
};

exports.generateMock = generateMock;

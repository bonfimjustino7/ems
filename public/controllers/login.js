const User = require("../models/user.models");
const { cryptHash } = require("../utils/crypt");

exports.Auth = async function (login, password) {
  try {
    const criptPassword = cryptHash(password);
    const user = await new User({ login, criptPassword }).filter(
      { login, password: criptPassword },
      1
    );
    if (user.length) {
      return { usuario: user[0].nome, usuario_id: user[0].id };
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

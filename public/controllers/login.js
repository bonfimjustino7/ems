const User = require("../models/user.models");
const { ToJson } = require("../utils/sql");

exports.Auth = async function (login, password) {
  try {
    const user = await new User({ login, password }).filter(
      { login, password },
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

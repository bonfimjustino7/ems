const User = require("../models/user.models");

exports.ListarUsuarios = async (filters, limit) => {
  try {
    let res;
    if (filters?.nome?.length) {
      res = await new User({}).filter(filters, limit);
    } else {
      res = await new User({}).findAll(limit);
    }
    const usuarios = JSON.parse(JSON.stringify(res));
    if (usuarios.length) {
      return usuarios;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.deleteUsuario = async function (data) {
  try {
    const { idUsuario } = data;
    await new User({}).delete(idUsuario);
    console.log(idUsuario);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

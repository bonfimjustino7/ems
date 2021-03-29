const User = require("../models/user.models");

exports.Auth = async function (login, password) {
  try {
    const res = await new User({ login, password }).filter(
      { login, password },
      1
    );
    const user = JSON.parse(JSON.stringify(res));
    if (user.length) {
      return user[0].login;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

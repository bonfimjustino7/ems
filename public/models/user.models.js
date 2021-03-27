const db = require("./generic.models");

const User = function (user) {
  this.login = user.login;
  this.password = user.password;
};
db.table = "usuario";

User.objects = db;

module.exports = User;

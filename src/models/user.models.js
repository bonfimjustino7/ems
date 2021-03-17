const db = require("../models/generic.models");

const User = function (user) {
  this.login = user.login;
  this.password = user.password;
};
db.table = "user";

User.objects = db;

module.exports = User;

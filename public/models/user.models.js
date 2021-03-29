const Consultas = require("./generic.models");

class User extends Consultas {
  constructor(user) {
    super("usuario");

    this.login = user.login;
    this.password = user.password;
    this.nome = user.nome;
    this.email = user.email;
    this.sobrenome = user.sobrenome;
    this.cpf = user.cpf;
    this.telefone = user.telefone;
    this.tipoconta = user.tipoconta;
    this.gerente = user.gerente;
  }
}

module.exports = User;

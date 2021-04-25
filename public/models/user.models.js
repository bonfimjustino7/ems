const Consultas = require("./generic.models");
const { cryptHash } = require("../utils/crypt");

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

  async createUser() {
    try {
      if (this.password) {
        this.password = cryptHash(this.password);
        await this.create();
      } else {
        throw new Error("A senha é obrigatória");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatePassword(id) {
    const password = cryptHash(this.password);
    const query = `UPDATE ${this.table_name} SET password = '${password}' WHERE id = ${id}`;
    console.log(query);
    try {
      const res = await this.execute(query);

      if (res) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

module.exports = User;

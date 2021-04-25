const Consultas = require("./generic.models");

class CodigoUsuario extends Consultas {
  constructor(codigo_usuario) {
    super("codigos_recuperacao");
    this.usuario_id = codigo_usuario.usuario_id;
    this.code = codigo_usuario.code;
  }
  async validate(code) {
    const queryStr =
      "SELECT code FROM codigos_recuperacao WHERE status = 'VALID' ORDER BY id DESC LIMIT 1";

    const res = await this.execute(queryStr);
    if (res && res.length > 0) {
      const valid = res[0].code === code;
      if (valid) {
        const queryUpdate = `UPDATE ${this.table_name} SET status = 'INVALID' WHERE code = ${code}`;
        await this.execute(queryUpdate);
        return valid;
      }
    }
    return null;
  }
  async createCode(email) {
    const query = `SELECT id FROM usuario WHERE email = '${email}' LIMIT 1`;

    const res = await this.execute(query);

    if (res && res.length > 0) {
      this.usuario_id = res[0].id;
      await this.create();
      return this.usuario_id;
    }
    return null;
  }
}

module.exports = CodigoUsuario;

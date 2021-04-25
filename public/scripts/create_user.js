const User = require("../models/user.models");
const readline = require("readline");

const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const data = {
  login: null,
  password: null,
  nome: null,
  email: null,
  sobrenome: null,
  cpf: null,
  telefone: null,
  tipoconta: 0,
  gerente: null,
};

function question(theQuestion) {
  return new Promise((resolve) =>
    leitor.question(theQuestion, (answ) => resolve(answ))
  );
}

async function Questions() {
  data.login = await question("Login: ");
  data.password = await question("Senha: ");
  data.nome = await question("Primeiro Nome: ");
  data.sobrenome = await question("Úlitmo Nome: ");
  data.email = await question("Email: ");
  data.cpf = await question("CPF: ");
  data.tipoconta = (await question("Gerente: (S ou N): ")) === "S" ? 1 : 0;
  try {
    await new User(data).createUser();
  } catch (error) {
    console.log(error);
  }

  console.log("Usuário gerado com sucesso");
  leitor.close();
}
Questions();

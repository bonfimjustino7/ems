const { ipcMain, BrowserWindow, dialog } = require("electron");
const { writeFileSync } = require("fs");
const path = require("path");
const {
  getProdutos,
  saveProduto,
  deleteProduto,
  AtualizarProduto,
} = require("./controllers/produtos");
const { Auth } = require("./controllers/login");
const {
  savePedido,
  getPedidos,
  finalizarPedidos,
  atualizarPedido,
  removerPedido,
} = require("./controllers/pedido");
const { sendMail } = require("./scripts/send_email");
const CodigoUsuario = require("./models/codigo.models");
const User = require("./models/user.models");
const { ListarUsuarios, deleteUsuario } = require("./controllers/users");
const { writeImg } = require("./utils/write");
const Pedido = require("./models/pedido.models");

ipcMain.on("login", async (event, data) => {
  const { login, password } = data;
  const resposta = await Auth(login, password);
  console.log(resposta);
  if (resposta) {
    event.reply("login-reply", resposta);
  } else {
    event.reply("login-reply", false);
  }
});

ipcMain.on("maximize-window", (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender);
  browserWindow.resizable = true;
  browserWindow.maximize();
});

ipcMain.on("size-window", (event, width, height) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender);
  browserWindow.restore();
  browserWindow.setSize(width, height);
  browserWindow.resizable = false;
});

ipcMain.on("produtos", async (event, data) => {
  const { limit } = data;
  delete data.limit;
  const resposta = await getProdutos(data, limit);
  if (resposta) {
    event.reply("produtos-reply", resposta);
  } else {
    event.reply("produtos-reply", []);
  }
});

ipcMain.on("save-produto", async (event, data) => {
  const { imagem, extensionImage } = data;

  const newData = {
    nome: data.nomeProduto,
    marca: data.marcaProduto,
    descricao: data.descricaoProduto,
    quantidade: data.quantidadeProduto,
    codigo_barras: data.codeProduto,
    preco: data.precoProduto,
    tipo: data.tipoProduto,
  };
  console.log(newData);

  if (imagem) {
    const res = await writeImg(newData.nome, imagem, extensionImage);
    newData.imagem = res;
  }

  const resposta = await saveProduto(newData);
  console.log("Resposta do save Produto: " + resposta);

  event.returnValue = true;
});

ipcMain.on("delete-produto", async (event, data) => {
  const resposta = await deleteProduto(data);
  event.returnValue = resposta;
});

ipcMain.on("update-produto", async (event, data) => {
  const { imagem, extensionImage } = data;

  const newData = {
    idProduto: data.id,
    nome: data.nomeProduto,
    marca: data.marcaProduto,
    descricao: data.descricaoProduto,
    quantidade: data.quantidadeProduto,
    codigo_barras: data.codeProduto,
    preco: data.precoProduto,
    tipo: data.tipoProduto,
  };

  if (imagem.startsWith("data:")) {
    try {
      const res = await writeImg(newData.nome, imagem, extensionImage);
      newData.imagem = res;
    } catch (error) {
      console.log(error);
    }
  } else {
    newData.imagem = imagem;
  }

  const res = await AtualizarProduto(newData);
  event.returnValue = res;
});

ipcMain.on("save-pedido", async (event, data) => {
  const { usuario_id, produto_id } = data;
  const pedidoOk = await savePedido({
    usuario_id: usuario_id,
    produto_id: produto_id,
  });
  if (pedidoOk) {
    event.reply("pedido-reply", produto_id);
  } else {
    event.reply("pedido-reply", null);
  }
});

ipcMain.on("pedidos", async (event, data) => {
  const { usuario_id } = data;
  const pedidos = await getPedidos({ usuario_id });
  event.reply("pedidos-reply", pedidos);
});

ipcMain.on("finalizar-pedido", async (event, data) => {
  const { usuario_id } = data;
  const resposta = await finalizarPedidos({ usuario_id });
  event.reply("finalizar-pedido-reply", resposta);
});

ipcMain.on("atualizar-pedido", async (event, data) => {
  const { pedido_id, quantidade } = data;
  const resposta = await atualizarPedido({ pedido_id, quantidade });
  event.reply("atualizar-pedido-reply", resposta);
});

ipcMain.on("remover-pedido", async (event, data) => {
  const { pedido_id } = data;
  const resposta = await removerPedido({ pedido_id });
  event.reply("remover-pedido-reply", resposta);
});

ipcMain.on("recuperar-senha", async (e, data) => {
  const { email } = data;

  try {
    const codigoRandom = Math.floor(Math.random() * 10000000);

    const res = await new CodigoUsuario({ code: codigoRandom }).createCode(
      email
    );
    if (res) {
      e.returnValue = res;
      await sendMail({
        from: "EMS - Easy Market System <admin@medicaronline.xyz>",
        to: [email],
        subject: "Recuperação de senha",
        text: `Olá, foi solicitado a recuperação de senha de ${email}\nPor favor insira o seguinte código: ${codigoRandom}, no campo "Código de Recuperação" no EMS.`,
      });
    } else {
      e.returnValue = null;
    }
  } catch (error) {
    console.log(error);
    e.returnValue = null;
  }
});

ipcMain.on("verify-code", async (e, data) => {
  const { code } = data;

  try {
    const res = await new CodigoUsuario({}).validate(code);
    e.returnValue = res;
  } catch (error) {
    console.log(error);
    e.returnValue = null;
  }
});

ipcMain.on("nova-senha", async (e, data) => {
  const { senha, usuarioID } = data;

  try {
    console.log(usuarioID);
    const res = await new User({ password: senha }).updatePassword(usuarioID);
    e.returnValue = res;
  } catch (error) {
    console.log(error);
    e.returnValue = null;
  }
});

ipcMain.on("usuarios", async (event, data) => {
  const { limit } = data;
  delete data.limit;
  const resposta = await ListarUsuarios(data, limit);
  if (resposta) {
    event.reply("usuarios-reply", resposta);
  } else {
    event.reply("usuarios-reply", []);
  }
});

ipcMain.on("save-usuario", async (event, data) => {
  try {
    await new User(data).createUser();
    event.reply("save-usuario-reply", true);
  } catch (error) {
    console.log(error);
    event.reply("save-usuario-reply", false);
  }
});
ipcMain.on("update-usuario", async (event, data) => {
  try {
    const { id } = data;
    await new User(data).updateUser(id);
    event.reply("update-usuario-reply", true);
  } catch (error) {
    console.log(error);
    event.reply("update-usuario-reply", false);
  }
});

ipcMain.on("delete-usuario", async (event, data) => {
  const resposta = await deleteUsuario(data);
  event.returnValue = resposta;
});

ipcMain.on("getVendas", async (event, data) => {
  const resposta = await new User({}).getPedidos(false);
  if (resposta) {
    event.reply("vendas", resposta);
  } else {
    event.reply("vendas", []);
  }
});

ipcMain.on("getCompras", async (event, data) => {
  const { usuario_id } = data;
  const resposta = await new User({}).getPedidos(usuario_id);
  if (resposta) {
    event.reply("vendas", resposta);
  } else {
    event.reply("vendas", []);
  }
});

ipcMain.on("dados-usuario", async (event, data) => {
  try {
    const { usuario_id } = data;
    const dados = await new User({}).findById(usuario_id);
    console.log("Usuario ID " + usuario_id);
    event.returnValue = dados;
  } catch (error) {
    event.returnValue = {};
  }
});

ipcMain.on("totais", async (event, data) => {
  try {
    const { usuario_id } = data;
    const dados = await new Pedido({}).getTotalPedidos(usuario_id);
    console.log(dados);
    event.returnValue = dados[0];
  } catch (error) {
    event.returnValue = {};
  }
});

ipcMain.on("qtd-tipo", async (event, data) => {
  try {
    const { usuario_id } = data;
    const dados = await new Pedido({}).quantidadeByTipoProduto(usuario_id);
    console.log(dados);
    event.returnValue = dados;
  } catch (error) {
    event.returnValue = {};
  }
});

// ipcMain.on("open-dialog", async (e, data) => {
//   dialog
//     .showOpenDialog({
//       title: "Selecione uma imagem",
//       defaultPath: path.join(__dirname, "image/"),
//       buttonLabel: "Upload",

//       filters: [
//         {
//           name: "Arquivos de Imagens",
//           extensions: ["png"],
//         },
//       ],
//       properties: ["openFile"],
//     })
//     .then((file) => {
//       console.log(file.canceled);

//       if (!file.canceled) {
//         // Updating the GLOBAL filepath variable
//         // to user-selected file.
//         const filepath = file.filePaths[0].toString();
//         e.returnValue = filepath;
//       } else {
//         e.returnValue = null;
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       e.returnValue = null;
//     });
// });

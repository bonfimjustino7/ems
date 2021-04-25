const { ipcMain, BrowserWindow } = require("electron");
const { writeFileSync } = require("fs");
const path = require("path");
const {
  getProdutos,
  saveProduto,
  deleteProduto,
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
  const { imageProduct } = data;

  const newData = {
    nome: data.nomeProduto,
    marca: data.marcaProduto,
    descricao: data.descricaoProduto,
    quantidade: data.quantidadeProduto,
    codigo_barras: data.codeProduto,
    preco: data.precoProduto,
    tipo: data.tipoProduto,
  };
  const filenameImage = `${path.join(__dirname)}/image/${data.nomeProduto}.png`;
  newData.imagem = `image/${data.nomeProduto}.png`;

  if (imageProduct) {
    console.log("image Produto");
    const base64Data = imageProduct.replace(/^data:image\/png;base64,/, "");
    await writeFileSync(filenameImage, base64Data, "base64", function (err) {
      console.log(err);
    });
  }

  const resposta = await saveProduto(newData);

  event.reply("produtos-save-reply", resposta);
});

ipcMain.on("delete-produto", async (event, data) => {
  const resposta = await deleteProduto(data);
  event.returnValue = resposta;
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

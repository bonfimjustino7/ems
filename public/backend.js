const { ipcMain, BrowserWindow } = require("electron");

const { getProdutos } = require("./controllers/produtos");
const { Auth } = require("./controllers/login");
const {
  savePedido,
  getPedidos,
  finalizarPedidos,
  atualizarPedido,
  removerPedido,
} = require("./controllers/pedido");

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

ipcMain.on("produtos", async (event, data) => {
  const resposta = await getProdutos(data);
  if (resposta) {
    event.reply("produtos-reply", resposta);
  } else {
    event.reply("produtos-reply", []);
  }
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

const { ipcMain, BrowserWindow } = require("electron");

const { getProdutos } = require("./controllers/produtos");
const { Auth } = require("./controllers/login");

ipcMain.on("login", async (event, data) => {
  const { login, password } = data;
  const resposta = await Auth(login, password);
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

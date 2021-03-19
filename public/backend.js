const { ipcMain } = require("electron");
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

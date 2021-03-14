const { app, BrowserWindow, dialog } = require("electron");

// Enable live reload for Electron too
require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});

const Store = require("electron-store");

const store = new Store();

app.on("ready", () => {
  createWindow();
});

const createWindow = (exports.createWindow = () => {
  let newWindow = null;
  if (store.get("login")) {
    newWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,

      webPreferences: {
        nodeIntegration: true,
      },
    });
    newWindow.loadFile("web/index.html");
  } else {
    newWindow = new BrowserWindow({
      width: 1100,
      height: 600,
      show: false,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    newWindow.loadFile("web/login.html");
    newWindow.loadURL("http://localhost:3000");
    newWindow.setMenu(null);
    newWindow.webContents.toggleDevTools();
  }

  const splash = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: "logo.jpeg",
    resizable: false,
  });
  splash.loadFile("web/splash.html");

  newWindow.once("ready-to-show", () => {
    setTimeout(() => {
      splash.close();
      newWindow.show();
    }, 3000);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
require("./backend.js");

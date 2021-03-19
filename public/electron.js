const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");

const isDev = require("electron-is-dev");

// Enable live reload for Electron too
if (isDev) {
  require("electron-reload")(__dirname, {
    electron: require(`${path.join(__dirname, "../node_modules/electron")}`),
  });
}

app.on("ready", () => {
  createWindow();
});

const createWindow = (exports.createWindow = () => {
  const newWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  newWindow.setMenu(null);
  // newWindow.webContents.openDevTools();

  const splash = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: "logo.jpeg",
    resizable: false,
  });
  splash.loadURL(
    isDev
      ? `file://${path.join(__dirname, "../public/splash.html")}`
      : `file://${path.join(__dirname, "../build/splash.html")}`
  );
  // splash.webContents.toggleDevTools();

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
require("./backend");
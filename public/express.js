const express = require("express");
const { app } = require("electron");

const appExpress = express();

const port = 3001;

appExpress.use("/files", express.static(app.getPath("pictures")));

appExpress.listen(port, () => {
  console.log("Servindo Arquivos estáticos");
});

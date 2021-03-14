const { ipcMain } = require("electron");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123",
  database: "loja",
  waitForConnections: true,
});

ipcMain.on("login", async (event, data) => {
  console.log(data);
  const res = await SelectAllElements();
  const row = res ? JSON.parse(JSON.stringify(res)) : null;
  console.log(row);
  if (row) {
    event.reply("login-reply", "Login ok");
  } else {
    console.log("Não conectado");
  }
});

const SelectAllElements = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM  user WHERE login='bonfim' AND password=123",
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements[0]);
      }
    );
  });
};

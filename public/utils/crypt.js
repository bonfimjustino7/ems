const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

exports.cryptHash = (password) => {
  const cypher = crypto.createHmac("sha256", process.env.SECRET_CRIPTOGRAPHY);
  const passwordCripted = cypher.update(password).digest("hex");
  return passwordCripted;
};

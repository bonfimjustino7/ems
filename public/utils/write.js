const { app } = require("electron");
const { writeFileSync } = require("fs");
const path = require("path");

exports.writeImg = (nomeProduto, imagem, extensionImage) => {
  return new Promise((resolve, reject) => {
    const extension = extensionImage.split("/")[1];
    try {
      const filenameImage = path.resolve(
        app.getPath("pictures"),
        `${nomeProduto}.${extension}`
      );

      const base64Data = imagem.replace(`data:${extensionImage};base64`, "");

      const res = writeFileSync(filenameImage, base64Data, "base64");

      resolve(`${nomeProduto}.${extension}`);
    } catch (error) {
      reject(error);
    }
  });
};

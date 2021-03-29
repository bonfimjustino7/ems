const fileSystem = require("fs");
const xml2json = require("xml2json");
const path = require("path");

exports.xmlToJson = function (filename) {
  var options = {
    object: true,
    reversible: false,
    coerce: true,
    sanitize: true,
    trim: true,
    arrayNotation: false,
    alternateTextNode: false,
  };

  try {
    const xmlString = fileSystem
      .readFileSync(`${path.join(__dirname, filename)}`)
      .toString();
    const json = xml2json.toJson(xmlString, options);
    return json;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const fs = require("fs");
const TEMPLATES_FOLDER = `${__dirname}/../templates`;

const loadTemplate = function(fileName, propertyBag) {
  const content = fs.readFileSync(`${TEMPLATES_FOLDER}/${fileName}`, "utf8");

  const replaceKeyWithValue = function(content, key) {
    const pattern = new RegExp(`__${key}__`, "g");
    return content.replace(pattern, propertyBag[key]);
  };

  const keys = Object.keys(propertyBag);
  return keys.reduce(replaceKeyWithValue, content);
};

module.exports = { loadTemplate };

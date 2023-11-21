const { setFips } = require("crypto");
const db = require("../db/connection");
const fs = require("fs/promises");

exports.sendAllTopics = () => {
  return db.query(`SELECT * FROM topics;`);
};

exports.readEndPointsJSON = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    return data;
  });
};

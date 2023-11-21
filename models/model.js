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

exports.getArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      const article = rows[0];

      if (rows.length !== 0) {
        return article;
      } else {
        return Promise.reject({ status: 404, msg: "bad request" });
      }
    });
};

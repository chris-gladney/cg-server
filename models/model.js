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
  if (Number(id) === NaN) {
    return Promise.reject({ status: 400, msg: "invalid id type" });
  }

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

exports.generateArticlesArray = () => {
  return db.query(`SELECT * FROM articles;`).then(({ rows }) => {
    return Promise.all(
      rows.map((article) => {
        return db
          .query(`SELECT * FROM comments WHERE article_id = $1`, [
            article.article_id,
          ])
          .then(({ rows }) => {
            article.comment_count = rows.length;
            return article;
          });
      })
    );
  });
};

exports.getCommentsById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return db
          .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};

exports.updateComments = (article_id, commentObj) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
            [commentObj.body, article_id, commentObj.username]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

exports.updateArticle = (inc_votes, article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return db.query(
          `UPDATE articles set votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
          [article_id, inc_votes]
        );
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

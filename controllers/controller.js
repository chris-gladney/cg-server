const {
  sendAllTopics,
  readEndPointsJSON,
  getArticleById,
} = require("../models/model");

exports.getAllTopics = (req, res, next) => {
  sendAllTopics().then(({ rows }) => {
    res.status(200).send(rows);
  });
};

exports.endpointsDescription = (req, res, next) => {
  readEndPointsJSON().then((endpoints) => {
    res.status(200).send(JSON.parse(endpoints));
  });
};

exports.sendArticle = (req, res, next) => {
  const { id } = req.params;
  getArticleById(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      res.status(err.status).send(err)
    });
};

const {
  sendAllTopics,
  readEndPointsJSON,
  getArticleById,
  generateArticlesArray,
  getCommentsById,
  updateComments,
  updateArticle,
  getCommentToDelete,
  generateUserArray,
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
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  generateArticlesArray(topic).then((data) => {
    res.status(200).send(data);
  });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  getCommentsById(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentObj = req.body;
  updateComments(article_id, commentObj)
    .then((newComment) => {
      res.status(201).send(newComment);
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promiseArray = [
    getCommentsById(comment_id),
    getCommentToDelete(comment_id),
  ];
  Promise.all(promiseArray)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  generateUserArray()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

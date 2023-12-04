const express = require("express");
const app = express();
const {
  getAllTopics,
  endpointsDescription,
  sendArticle,
  getAllArticles,
  getComments,
  postComment,
  patchArticle,
} = require("./controllers/controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.use(express.json());

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", sendArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

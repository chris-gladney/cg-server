const express = require("express");
const app = express();
const {
  getAllTopics,
  endpointsDescription,
  sendArticle,
} = require("./controllers/controller");

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", sendArticle);

module.exports = app;

const express = require("express");
const app = express();
const {
  getAllTopics,
  endpointsDescription,
  sendArticle,
} = require("./controllers/controller");
const { handleBadRequest } = require("./errors");

app.use(express.json());

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", sendArticle);

app.use(handleBadRequest);

module.exports = app;

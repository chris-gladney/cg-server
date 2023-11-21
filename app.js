const express = require("express");
const app = express();
const {
  getAllTopics,
  endpointsDescription,
  sendArticle,
} = require("./controllers/controller");
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors');
  

app.use(express.json());

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", sendArticle);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

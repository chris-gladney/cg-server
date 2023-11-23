const express = require("express");
const app = express();
const {
  getAllTopics,
  endpointsDescription,
  sendArticle,
  getAllArticles,
  getComments,
} = require("./controllers/controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const { PORT = 9090 } = process.env;

app.use(express.json());

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", sendArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/:article_id/comments", getComments);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.exports = app;

const express = require("express");
const app = express();
const { getAllTopics, endpointsDescription } = require("./controllers/controller");

app.get("/api", endpointsDescription);

app.get("/api/topics", getAllTopics);

module.exports = app;

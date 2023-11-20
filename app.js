const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/controller');

app.get('/api/topics', getAllTopics);

module.exports = app;
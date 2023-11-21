const { sendAllTopics, readEndPointsJSON } = require("../models/model");

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

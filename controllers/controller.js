const { sendAllTopics } = require('../models/model');

exports.getAllTopics = (req, res, next) => {
    sendAllTopics().then(({ rows }) => {
        res.status(200).send(rows)
    })
}
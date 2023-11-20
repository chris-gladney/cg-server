const db = require('../db/connection');

exports.sendAllTopics = () => {
    return db.query(`SELECT * FROM topics;`);
}
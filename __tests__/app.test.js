const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index');

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
    db.end();
});

describe("GET /api/topics", () => {
    test("Should respond with an array of response objects, each object having properties of slug and description", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(topicData);
      });
    });
});
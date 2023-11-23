const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("Should respond with an array of response objects, each object having properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("Should return an object describing all the endpoints available to the user with descriptions and example responses", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:articleId", () => {
  test("Should return an article object with the relevant properties", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("Should return a 404 error if client attempts to access id that doens't exist", () => {
    return request(app)
      .get("/api/articles/55")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("Should return a 400 error if clients attempts to access id using invalid id type", () => {
    return request(app)
      .get("/api/articles/carrot")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  test("Should return status 200 and an array including all articles in the right format", () => {
    return request(app)
      .get("/api/articles")
      .then((res) => {
        if (res.body.length !== 0) {
          expect(200);
        } else {
          expect(404);
        }
        return res;
      })
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(body).toBeSorted("created_at", { descending: true });
      });
  });
});

describe("GET /api/:article_id/comments", () => {
  test("Should return 200 and relevant array of comments when given valid id", () => {
    return request(app)
      .get("/api/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((commentObj) => {
          expect(commentObj).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("Should return 404 if given a valid format id that doesn't exist in comments database", () => {
    return request(app)
      .get("/api/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });

  test("Should return 400 and send back error message if given invalid id format", () => {
    return request(app)
      .get("/api/carrot/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });

  test("Should check that the comments sent back are ordered by most recent first", () => {
    return request(app)
      .get("/api/1/comments")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeSorted("created_at", { descending: true });
      });
  });

  test("Should return status 200 and an empty response body if passed a valid id but there are no comments", () => {
    return request(app)
      .get("/api/2/comments")
      .expect(({ body }) => {
        expect(body).toEqual([]);
      });
  });
});

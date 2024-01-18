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
      .get("/api/articles/1/comments")
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
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });

  test("Should return 400 and send back error message if given invalid id format", () => {
    return request(app)
      .get("/api/articles/carrot/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });

  test("Should check that the comments sent back are ordered by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeSorted("created_at", { descending: true });
      });
  });

  test("Should return status 200 and an empty response body if passed a valid id but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(({ body }) => {
        expect(body).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Expect 201 when given valid article id and response body should return the posted comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge",
        body: "Obi will hate this!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          comment_id: 19,
          body: "Obi will hate this!",
          article_id: 5,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
        return db.query(`SELECT * FROM comments WHERE comment_id = 19;`);
      })
      .then(({ rows }) => {
        expect(rows[0]).toEqual({
          comment_id: 19,
          body: "Obi will hate this!",
          article_id: 5,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(Object),
        });
      });
  });

  test("Should return 404 if given a valid id that doesn't exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        username: "Any",
        body: "Any",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });

  test("Should return 400 if given invalid id format", () => {
    return request(app)
      .post("/api/articles/carrot/comments")
      .send({
        username: "Any",
        body: "Any",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });

  test("Should return 404 if given an invalid username", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "GrumpyCat17",
        body: "Any",
      })
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Should return updated article with correctly incremented votes with status code of 201", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
          article_img_url: expect.any(String),
        });
      });
  });

  test("Should return 400 if given invalid id format", () => {
    return request(app)
      .patch("/api/articles/carrot")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });

  test("Should return 404 if given valid id format not associated with any article", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });

  test("Should throw a 400 error if given an inc_votes of incorrect format", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Should throw 400 error if given a comment_id of invalid format", () => {
    return request(app).delete("/api/comments/carrot").expect(400);
  });

  test("Should throw a 404 error if given a valid comment_id that doesn't exist", () => {
    return request(app).delete("/api/comments/199").expect(404);
  });

  test("Should return a 204 if given a vlid comment_id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
});

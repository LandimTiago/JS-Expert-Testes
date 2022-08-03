const { describe, it } = require("mocha");
const request = require("supertest");
const assert = require("assert");

const app = require("./api");

describe("API Suite test", () => {
  describe("/contact", () => {
    it("Should request the contact page and return HTTP Status 200", async () => {
      const response = await request(app).get("/contact").expect(200);

      assert.deepStrictEqual(response.text, "Contact us page");
    });
  });

  describe("/hello", () => {
    it("Should request an inexistent route /hi and redirect to /hello", async () => {
      const response = await request(app).get("/hi").expect(200);

      assert.deepStrictEqual(response.text, "Hello World");
    });
  });

  describe("/login", () => {
    it("Should login successfully on the login route and return HTTP Status 200", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "Tiago Landim", password: "123" })
        .expect(200);

      assert.deepStrictEqual(response.text, "Logging has succed");
    });
  });

  describe("/login", () => {
    it("Should unauthorize a request when requesting it using wrong credentials and return HTTP Status 401", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "Tiago Landim", password: "32122" })
        .expect(401);

      assert.ok(response.unauthorized);
      assert.deepStrictEqual(response.text, "Loggin id faliled!");
    });
  });
});

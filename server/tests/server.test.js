const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

//require("dotenv").config();

const mongoDBuri = "mongodb+srv://apadyal:password%401234@nbad.q1uxsmy.mongodb.net/?retryWrites=true&w=majority";

// /* Connecting to the database before each test. */
// beforeEach(async () => {
//     await mongoose.connect(mongoDBuri);
//   });
  
//   /* Closing database connection after each test. */
//   afterEach(async () => {
//     await mongoose.connection.close();
//   });

  describe("GET /categories", () => {
    it("should return all budget categories", async () => {
      const res = await request(app).get("/categories");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
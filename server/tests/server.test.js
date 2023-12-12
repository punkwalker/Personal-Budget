const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

const mongoDBuri = "mongodb+srv://apadyal:password%401234@nbad.q1uxsmy.mongodb.net/?retryWrites=true&w=majority";

  describe("GET /categories", () => {
    it("should return all budget categories", async () => {
      const res = await request(app).get("/categories");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /user", () => {
    it("should return a user if user has already signed up", async () => {
      const res = await request(app).get("/user?userName=a@b.com");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /budget", () => {
    it("should return budget for the existing user", async () => {
      const res = await request(app).get("/budget?userObjectID=6576472fe0e781b0e91a0d4a");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /expense", () => {
    it("should return expense for the existing user", async () => {
      const res = await request(app).get("/expense?userObjectID=6576472fe0e781b0e91a0d4a&month=Jan");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("POST /expense", () => {
    it("should save an expense for the existing user", async () => {
        var expenseData = {
            userObjectId: "6576472fe0e781b0e91a0d4a",
            month: "Mar",
            category: "Travel",
            expense: 336
          }
      const res = await request(app).post("/expense").send(expenseData);
      expect(res.statusCode).toBe(200);
    });
  });
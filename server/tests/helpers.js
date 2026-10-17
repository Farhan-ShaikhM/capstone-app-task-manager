// Small helpers shared by the test files
const request = require("supertest");
const app = require("../app");

// Registers a user and returns their JWT token
const registerUser = async (overrides = {}) => {
  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "secret123",
    ...overrides
  };

  const res = await request(app).post("/api/auth/register").send(user);
  return { token: res.body.token, user: res.body.user, res };
};

// Builds a valid task body (due date one week from now)
const validTask = (overrides = {}) => ({
  title: "Write unit tests",
  description: "Cover auth and task routes",
  priority: "high",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  ...overrides
});

module.exports = { app, request, registerUser, validTask };

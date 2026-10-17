const { app, request, registerUser } = require("./helpers");

describe("POST /api/auth/register", () => {
  it("creates a user and returns a token without the password", async () => {
    const { res } = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects a duplicate email", async () => {
    await registerUser();
    const { res } = await registerUser();

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("rejects an invalid email", async () => {
    const { res } = await registerUser({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", async () => {
    const { res } = await registerUser({ password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  it("ignores a role sent by the client (no self-registering as admin)", async () => {
    const { res } = await registerUser({ role: "admin" });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("student");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("gives the same error for an unknown email (no user enumeration)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "secret123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("requires both email and password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the logged-in user when given a valid token", async () => {
    const { token } = await registerUser();

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not.a.real.token");

    expect(res.status).toBe(401);
  });
});

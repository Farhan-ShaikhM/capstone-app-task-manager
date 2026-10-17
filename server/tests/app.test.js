const { app, request } = require("./helpers");

describe("General API behaviour", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("sends security headers (helmet)", async () => {
    const res = await request(app).get("/api/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("rejects request bodies larger than 10kb", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@b.com", password: "x".repeat(20000) });

    expect(res.status).toBe(413);
  });

  it("returns 400 (not 500) for malformed JSON", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email": "a@b.com",');

    expect(res.status).toBe(400);
  });
});

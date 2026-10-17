const { app, request, registerUser, validTask } = require("./helpers");

// Creates a task for the given user and returns the created task
const createTask = async (token, overrides) => {
  const res = await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send(validTask(overrides));
  return res.body.data;
};

describe("Task routes", () => {
  let token;

  beforeEach(async () => {
    ({ token } = await registerUser());
  });

  describe("authentication", () => {
    it("blocks requests without a token", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/tasks", () => {
    it("creates a task for the logged-in user", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(validTask());

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Write unit tests");
      expect(res.body.data.status).toBe("pending");
    });

    it("allows an empty description", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(validTask({ description: "" }));

      expect(res.status).toBe(201);
    });

    it("rejects a task without a title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(validTask({ title: "" }));

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/title is required/i);
    });

    it("rejects an invalid priority", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(validTask({ priority: "urgent" }));

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/tasks", () => {
    it("returns only the logged-in user's tasks", async () => {
      await createTask(token, { title: "My task" });

      const other = await registerUser({ email: "other@example.com" });
      await createTask(other.token, { title: "Someone else's task" });

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("My task");
    });

    it("filters by status", async () => {
      await createTask(token, { title: "Pending task" });
      await createTask(token, { title: "Finished task", status: "done" });

      const res = await request(app)
        .get("/api/tasks?status=done")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Finished task");
      expect(res.body.totalCount).toBe(2);
    });

    it("searches title and description, case-insensitive", async () => {
      await createTask(token, { title: "Buy groceries" });
      await createTask(token, { title: "Fix bug", description: "Login page GROCERY icon" });
      await createTask(token, { title: "Read book", description: "" });

      const res = await request(app)
        .get("/api/tasks?search=grocer")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data).toHaveLength(2);
    });

    it("sorts by priority, high first", async () => {
      await createTask(token, { title: "Low", priority: "low" });
      await createTask(token, { title: "High", priority: "high" });
      await createTask(token, { title: "Medium", priority: "medium" });

      const res = await request(app)
        .get("/api/tasks?sort=priority")
        .set("Authorization", `Bearer ${token}`);

      const titles = res.body.data.map((t) => t.title);
      expect(titles).toEqual(["High", "Medium", "Low"]);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("updates the user's own task", async () => {
      const task = await createTask(token);

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validTask(), status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("done");
    });

    it("forbids updating another user's task", async () => {
      const task = await createTask(token);
      const other = await registerUser({ email: "other@example.com" });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${other.token}`)
        .send({ ...validTask(), title: "Hacked" });

      expect(res.status).toBe(403);
    });

    it("returns 404 for a malformed task id", async () => {
      const res = await request(app)
        .put("/api/tasks/not-a-valid-id")
        .set("Authorization", `Bearer ${token}`)
        .send(validTask());

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("deletes the user's own task", async () => {
      const task = await createTask(token);

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const list = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(list.body.data).toHaveLength(0);
    });

    it("forbids deleting another user's task", async () => {
      const task = await createTask(token);
      const other = await registerUser({ email: "other@example.com" });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${other.token}`);

      expect(res.status).toBe(403);
    });

    it("returns 404 for a task that does not exist", async () => {
      const res = await request(app)
        .delete("/api/tasks/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});

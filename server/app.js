// Builds the Express app (middleware + routes) without starting the server.
// Keeping this separate from server.js lets the tests import the app
// and send requests to it without opening a real port or database.
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./middleware/logger");
const corsHandler = require("./middleware/corsHandler");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Limit login/register attempts to slow down brute-force password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,                // max 20 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes"
  }
});

app.use(helmet());                         // 1. secure HTTP headers
app.use(logger);                           // 2. request logging
app.use(corsHandler);                      // 3. CORS
app.use(express.json({ limit: "10kb" }));  // 4. JSON body parser with size limit

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date()
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler); // 404 catch-all
app.use(errorHandler);    // error handler (4 args, always last)

module.exports = app;

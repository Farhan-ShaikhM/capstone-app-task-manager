const logger = (req, res, next) => {
  // Keep test output clean
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const start = Date.now();

  // 'finish' fires when the response has been fully sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${req.ip} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};

module.exports = logger;
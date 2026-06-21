const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const smartQueueRoutes = require("./routes/smartQueueRoutes");

function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || "*";
  const corsOptions =
    corsOrigin === "*"
      ? { origin: true, credentials: false }
      : {
          origin: corsOrigin.split(",").map((s) => s.trim()),
          credentials: true,
        };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use("/api/auth", authRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/smartqueue", smartQueueRoutes);

  // Global error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Server error";
    return res.status(status).json({ message });
  });

  return app;
}

module.exports = { createApp };

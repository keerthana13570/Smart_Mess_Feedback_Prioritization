require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { createApp } = require("./app");
const { connectDb } = require("./config/db");
const { computeSmartQueue } = require("./services/smartQueueService");

async function main() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Check your .env file.");
  }

  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("[socket] client connected:", socket.id);
    socket.emit("connected", { ok: true });
    computeSmartQueue()
      .then((queue) => socket.emit("smartqueue:update", queue))
      .catch(() => {});
  });

  await connectDb(process.env.MONGO_URI);

  const port = Number(process.env.PORT) || 5001;
  server.listen(port, "0.0.0.0", () => {
    console.log(`\n✅ SmartQueue backend running on http://localhost:${port}`);
    console.log(`   Health check: http://localhost:${port}/health\n`);
  });
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});

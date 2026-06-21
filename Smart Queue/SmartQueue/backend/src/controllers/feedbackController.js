const Feedback = require("../models/Feedback");
const { computeSmartQueue } = require("../services/smartQueueService");

const allowedTopics = new Set(["taste", "hygiene", "delay", "spicy", "others"]);
const allowedSeverity = new Set(["minor", "moderate", "serious"]);

async function addFeedback(req, res) {
  const { message, topic, severity } = req.body || {};
  if (!message || !topic || !severity) {
    return res.status(400).json({ message: "message, topic, severity are required" });
  }

  const trimmedMessage = String(message).trim();
  if (!trimmedMessage) {
    return res.status(400).json({ message: "message cannot be empty" });
  }
  if (trimmedMessage.length > 500) {
    return res.status(400).json({ message: "message must be 500 characters or fewer" });
  }
  if (!allowedTopics.has(topic)) {
    return res.status(400).json({ message: "Invalid topic" });
  }
  if (!allowedSeverity.has(severity)) {
    return res.status(400).json({ message: "Invalid severity" });
  }

  const created = await Feedback.create({
    userId: req.user._id,
    message: trimmedMessage,
    topic,
    severity,
  });

  // Recompute and broadcast updated queue.
  const io = req.app.get("io");
  if (io) {
    computeSmartQueue()
      .then((queue) => io.emit("smartqueue:update", queue))
      .catch(() => {});
  }

  return res.status(201).json({ feedback: created });
}

async function getMyFeedback(req, res) {
  const items = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json({ feedback: items });
}

async function getAllFeedback(req, res) {
  const items = await Feedback.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .lean();
  return res.json({ feedback: items });
}

module.exports = { addFeedback, getMyFeedback, getAllFeedback };


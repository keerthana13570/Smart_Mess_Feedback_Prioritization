const Feedback = require("../models/Feedback");

const TOPICS = ["taste", "hygiene", "delay", "spicy", "others"];

const severityWeight = {
  minor: 1,
  moderate: 2,
  serious: 3,
};

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyTopic({ message, topic }) {
  const text = normalizeText(message);
  const rules = [
    { topic: "hygiene", keywords: ["hygiene", "dirty", "unclean", "smell", "odor", "hair", "insect", "bug", "flies"] },
    { topic: "delay", keywords: ["delay", "late", "waiting", "queue", "slow", "time", "hours", "served late"] },
    { topic: "spicy", keywords: ["spicy", "chilli", "chili", "pepper", "hot"] },
    { topic: "taste", keywords: ["taste", "tasty", "salty", "sweet", "sour", "bland", "stale", "oil", "oily"] },
  ];

  for (const r of rules) {
    if (r.keywords.some((k) => text.includes(k))) return r.topic;
  }
  if (TOPICS.includes(topic)) return topic;
  return "others";
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function computeSmartQueue({ now = new Date() } = {}) {
  const nowDate = new Date(now);
  const last7d = new Date(nowDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const feedback = await Feedback.find({})
    .select("_id message topic severity createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const groups = new Map();

  for (const fb of feedback) {
    const t = classifyTopic({ message: fb.message, topic: fb.topic });
    const entry = groups.get(t) || {
      topic: t,
      number_of_reports: 0,
      recurrence_last_7_days: 0,
      severity_weight: 0,
      severity_level: "minor",
      latest_timestamp: null,
      sampleMessages: [],
    };

    entry.number_of_reports += 1;

    if (!entry.latest_timestamp || fb.createdAt > entry.latest_timestamp) {
      entry.latest_timestamp = fb.createdAt;
    }

    if (fb.createdAt >= last7d) entry.recurrence_last_7_days += 1;

    const w = severityWeight[fb.severity] || 1;
    if (w > entry.severity_weight) {
      entry.severity_weight = w;
      entry.severity_level = fb.severity;
    }

    if (entry.sampleMessages.length < 3) entry.sampleMessages.push(fb.message);

    groups.set(t, entry);
  }

  const results = Array.from(groups.values()).map((g) => {
    const score =
      0.5 * g.number_of_reports + 0.3 * g.recurrence_last_7_days + 0.2 * g.severity_weight;

    return {
      topic: g.topic,
      number_of_reports: g.number_of_reports,
      recurrence_last_7_days: g.recurrence_last_7_days,
      severity_weight: g.severity_weight || 1,
      severity_level: g.severity_level,
      score: round2(score),
      latest_timestamp: g.latest_timestamp,
      sampleMessages: g.sampleMessages,
    };
  });

  results.sort((a, b) => b.score - a.score || +new Date(b.latest_timestamp) - +new Date(a.latest_timestamp));

  return results;
}

module.exports = { computeSmartQueue, classifyTopic, severityWeight };


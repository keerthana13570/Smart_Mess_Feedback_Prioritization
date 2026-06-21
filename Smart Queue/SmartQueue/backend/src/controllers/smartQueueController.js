const { computeSmartQueue } = require("../services/smartQueueService");

async function getSmartQueue(req, res) {
  const queue = await computeSmartQueue();
  return res.json({ queue });
}

module.exports = { getSmartQueue };


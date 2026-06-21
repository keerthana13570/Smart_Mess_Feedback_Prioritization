const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { getSmartQueue } = require("../controllers/smartQueueController");

const router = express.Router();

router.get("/", requireAuth, requireAdmin, getSmartQueue);

module.exports = router;


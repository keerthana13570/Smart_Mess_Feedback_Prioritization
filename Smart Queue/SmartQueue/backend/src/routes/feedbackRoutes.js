const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { addFeedback, getMyFeedback, getAllFeedback } = require("../controllers/feedbackController");

const router = express.Router();

router.post("/add", requireAuth, addFeedback);
router.get("/user", requireAuth, getMyFeedback);
router.get("/all", requireAuth, requireAdmin, getAllFeedback);

module.exports = router;


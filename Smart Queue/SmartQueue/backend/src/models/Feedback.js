const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    topic: {
      type: String,
      enum: ["taste", "hygiene", "delay", "spicy", "others"],
      required: true,
      index: true,
    },
    severity: { type: String, enum: ["minor", "moderate", "serious"], required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

FeedbackSchema.index({ topic: 1, createdAt: -1 });
FeedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", FeedbackSchema);


const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    last_used_at: { type: Date, default: null },
    notified: { type: Boolean, default: false },
    notified_at: { type: Date, default: null },
  },
  { timestamps: true }
); // createdAt, updatedAt 자동 생성

module.exports = mongoose.model("UserStats", userStatsSchema);

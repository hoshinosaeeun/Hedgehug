const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    emotion: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Diary", diarySchema);

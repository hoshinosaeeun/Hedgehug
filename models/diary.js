const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  content: String,
  emotion: String,
});

module.exports = mongoose.model("Diary", diarySchema);

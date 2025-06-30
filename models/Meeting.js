const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  category: String,
  description: String,
  type: {
    type: String,
    enum: ["challenge", "offline"],
    required: true,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);

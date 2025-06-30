const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
  description: String,
  deadline: Date,
});

module.exports = mongoose.model("Mission", missionSchema);

const mongoose = require("mongoose");

const userMissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: "Mission" },
  isCleared: { type: Boolean, default: false },
});

userMissionSchema.index({ userId: 1, missionId: 1 }, { unique: true });

module.exports = mongoose.model("UserMission", userMissionSchema);

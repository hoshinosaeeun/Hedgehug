const mongoose = require("mongoose");

const userMeetingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
});

userMeetingSchema.index({ userId: 1, meetingId: 1 }, { unique: true });

module.exports = mongoose.model("UserMeeting", userMeetingSchema);

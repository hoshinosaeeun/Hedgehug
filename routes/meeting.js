const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const Meeting = require("../models/Meeting");
const UserMeeting = require("../models/UserMeeting");

router.get("/challenges", async (req, res) => {
  const challenges = await Meeting.find({ type: "challenge" });
  res.json(challenges);
});

router.post("/offline", async (req, res) => {
  const { category, description } = req.body;
  const meeting = new Meeting({ category, description, type: "offline" });
  await meeting.save();
  res.status(201).json(meeting);
});

router.post("/join", auth, async (req, res) => {
  const { meetingId } = req.body;

  try {
    const record = new UserMeeting({ userId: req.userId, meetingId });
    await record.save();
    res.status(201).json({ message: "참여 완료" });
  } catch (err) {
    res.status(400).json({ message: "이미 참여 중이거나 오류 발생" });
  }
});

module.exports = router;

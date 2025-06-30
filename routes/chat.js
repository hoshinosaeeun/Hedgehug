const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const UserMeeting = require("../models/UserMeeting");

router.get("/:meetingId", async (req, res) => {
  const { meetingId } = req.params;

  try {
    const chats = await Chat.find({ chatRoomId: meetingId })
      .sort({ sentAt: 1 })
      .populate("senderId", "name");

    res.json(chats);
  } catch (err) {
    console.error("채팅 불러오기 오류:", err);
    res.status(500).json({ message: "채팅 로딩 실패" });
  }
});

module.exports = router;

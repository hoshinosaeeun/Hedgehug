const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Diary = require("../models/diary");

router.post("/", auth, async (req, res) => {
  const { content, date, emotion } = req.body;

  try {
    const diary = new Diary({
      user_id: req.userId,
      date,
      content,
      emotion,
    });
    await diary.save();
    res.status(201).json({ message: "일기 저장 완료" });
  } catch (err) {
    console.error("일기 저장 오류:", err);
    res.status(500).json({ message: "저장 실패" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const UserMission = require("../models/UserMission");
const UserStats = require("../models/UserStats");
const Mission = require("../models/Mission");

// ✅ 미션 완료 처리 + 통계 업데이트
router.post("/complete", auth, async (req, res) => {
  const { missionId } = req.body;

  try {
    // 1. 미션 완료 처리
    const updated = await UserMission.findOneAndUpdate(
      { userId: req.userId, missionId },
      { isCleared: true },
      { upsert: true, new: true }
    );

    // 2. 전체 미션 개수
    const totalMissions = await Mission.countDocuments();

    // 3. 해당 사용자가 완료한 미션 개수
    const clearedMissions = await UserMission.countDocuments({
      userId: req.userId,
      isCleared: true,
    });

    // 4. 완료율 계산
    const percentage =
      totalMissions > 0
        ? Math.round((clearedMissions / totalMissions) * 100)
        : 0;

    // 5. UserStats에 저장 또는 갱신
    await UserStats.findOneAndUpdate(
      { userId: req.userId },
      { completionRate: percentage, updatedAt: new Date() },
      { upsert: true }
    );

    res.status(200).json({ message: "미션 완료 처리됨", updated });
  } catch (err) {
    console.error("미션 등록 또는 통계 갱신 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;

const cron = require("node-cron");
const UserMission = require("../models/UserMission");
const Mission = require("../models/Mission");
const User = require("../models/User");
const UserStats = require("../models/UserStats");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🕛 매일 정각 스케줄 실행 시작");

    // 1. 모든 미션 완료 여부 초기화
    await UserMission.updateMany({}, { isCleared: false });

    // 2. 사용자별 완료율 재계산
    const users = await User.find();
    const totalMissions = await Mission.countDocuments();

    for (const user of users) {
      const cleared = await UserMission.countDocuments({
        userId: user._id,
        isCleared: true,
      });

      const percentage =
        totalMissions > 0 ? Math.round((cleared / totalMissions) * 100) : 0;

      await UserStats.findOneAndUpdate(
        { userId: user._id },
        { completionRate: percentage, updatedAt: new Date() },
        { upsert: true }
      );
    }

    console.log("✅ 미션 초기화 및 통계 갱신 완료");
  } catch (err) {
    console.error("⛔ 스케줄 작업 중 오류 발생:", err);
  }
});

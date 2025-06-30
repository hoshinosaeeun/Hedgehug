const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserMission = require("../models/UserMission");
const Mission = require("../models/Mission");
const UserStats = require("../models/UserStats");

const sendPushNotification = require("../utils/sendPushNotification"); // 알림 보내는 함수 (가정)

const INACTIVITY_LIMIT_HOURS = 10;

router.get("/stats", async (req, res) => {
  const users = await User.find();
  const totalMissions = await Mission.countDocuments();
  const now = new Date();

  const result = await Promise.all(
    users.map(async (user) => {
      const cleared = await UserMission.countDocuments({
        userId: user._id,
        isCleared: true,
      });
      const percentage =
        totalMissions > 0 ? Math.round((cleared / totalMissions) * 100) : 0;

      const userStats = await UserStats.findOne({ userId: user._id });

      let notified = userStats?.notified || false;
      let notified_at = userStats?.notified_at || null;
      let last_used_at = userStats?.last_used_at || null;

      // 알림 조건: 마지막 사용 시간으로부터 10시간 이상 경과 && 아직 알림 안 보냄
      const hoursInactive = last_used_at
        ? (now - new Date(last_used_at)) / (1000 * 60 * 60)
        : Infinity;

      if (hoursInactive >= INACTIVITY_LIMIT_HOURS && !notified) {
        // 알림 전송 (푸시 또는 저장)
        await sendPushNotification(user._id, "오랫동안 활동이 없으시네요!");

        // 상태 갱신
        if (userStats) {
          userStats.notified = true;
          userStats.notified_at = now;
          await userStats.save();
        } else {
          await UserStats.create({
            userId: user._id,
            last_used_at: null,
            notified: true,
            notified_at: now,
          });
        }
        notified = true;
        notified_at = now;
      }

      return {
        id: userStats?._id || null,
        user_id: user._id,
        name: user.name,
        mission_completion: percentage,
        last_used_at,
        notified,
        notified_at,
        created_at: userStats?.createdAt || null,
        updated_at: userStats?.updatedAt || null,
      };
    })
  );

  res.json(result);
});

module.exports = router;

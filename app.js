const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const meetingRoutes = require("./routes/meeting");
const adminRoutes = require("./routes/admin");
const diaryRoutes = require("./routes/diary");
const missionRoutes = require("./routes/mission");

const Chat = require("./models/chat");
const UserMeeting = require("./models/UserMeeting");
require("./utils/scheduler");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = "express";
const FRONTEND_URL = "http://localhost:5500";

mongoose
  .connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
  })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 오류:", err));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/meeting", meetingRoutes);
app.use("/admin", adminRoutes);
app.use("/diary", diaryRoutes);
app.use("/mission", missionRoutes);

app.get("/", (req, res) => {
  res.send("서버가 정상 작동 중입니다.");
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("토큰이 없습니다."));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("소켓 인증 실패:", err);
    next(new Error("인증 실패"));
  }
});

io.on("connection", async (socket) => {
  console.log("사용자 연결됨:", socket.id);

  socket.on("join", ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log(`사용자 ${socket.userId}가 채팅방 ${chatRoomId}에 입장`);
  });

  socket.on("chat message", async ({ chatRoomId, message }) => {
    console.log("메시지 받음:", { chatRoomId, message });

    const isMember = await UserMeeting.exists({
      userId: socket.userId,
      meetingId: chatRoomId,
    });
    if (!isMember) return;

    const newChat = new Chat({
      chatRoomId,
      senderId: socket.userId,
      content: message,
    });
    await newChat.save();

    io.to(chatRoomId).emit("chat message", newChat);
  });

  socket.on("disconnect", () => {
    console.log("사용자 연결 종료:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error("서버 에러:", err);
  res.status(500).json({ message: "서버 내부 오류" });
});

server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

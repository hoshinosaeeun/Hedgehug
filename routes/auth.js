const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//const bcrypt = require('bcrypt');
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { role, userid, password, name, age, phone, address, detailAddress } =
    req.body;

  console.log("회원가입 요청 데이터:", req.body);

  try {
    const existingUser = await User.findOne({ userid });
    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 사용자입니다." });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      role,
      userid,
      password,
      name,
      age,
      phone,
      address,
      detailAddress,
    });

    await newUser.save();

    res.status(201).json({ message: "회원가입 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 실패" });
  }
});

router.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  try {
    const user = await User.findOne({ userid });

    if (!user) {
      return res
        .status(401)
        .json({ message: "로그인 실패: 아이디 또는 비밀번호가 틀렸습니다." });
    }

    //const isMatch = await bcrypt.compare(password, user.password);
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "로그인 실패: 아이디 또는 비밀번호가 틀렸습니다." });
    }

    const token = jwt.sign(
      { userId: user._id, userid: user.userid, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userid: user.userid, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그인 오류" });
  }
});

module.exports = router;

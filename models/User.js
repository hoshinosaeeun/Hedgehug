const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  userid: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  detailAddress: { type: String, required: true },
  last_active: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

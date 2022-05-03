const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { unique: true, required: true, type: String },
  firstName: { type: String },
  lastName: { type: String },
  avatarUrl: { type: String },
  goal: { type: String },
  traits: { default: [], type: [String] },
  learningInterests: { type: [String], default: [] },
  achievements: { type: [String], default: ["OG"] },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

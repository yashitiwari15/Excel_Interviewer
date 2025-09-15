const mongoose = require('mongoose');

const UserResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  experience: String,
  score: Number,
  skillLevel: String,
  strengths: [String],
  improvements: [String],
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserResult', UserResultSchema);

const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeUrl: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
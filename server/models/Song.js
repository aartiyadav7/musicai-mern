const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  releaseYear: {
    type: Number
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=No+Cover'
  },
  audioUrl: {
    type: String,
    required: true
  },
  plays: {
    type: Number,
    default: 0
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'focus']
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search optimization
songSchema.index({ title: 'text', artist: 'text', album: 'text' });

module.exports = mongoose.model('Song', songSchema);

const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  reason: {
    type: String
  },
  basedOn: {
    type: String,
    enum: [
      'AI analysis', 
      'user preferences', 
      'mood', 
      'genre', 
      'database matching',  // ← Make sure this is here
      'listening history'
    ],
    default: 'user preferences'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);

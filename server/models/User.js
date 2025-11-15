const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  preferences: {
    favoriteGenres: [String],
    favoriteArtists: [String],
    mood: {
      type: String,
      default: 'happy'
    }
  },
  favoriteSongs: [{                    // ← ADD THIS FIELD
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  listeningHistory: [{
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

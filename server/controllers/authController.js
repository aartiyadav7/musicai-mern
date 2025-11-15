const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config/config');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      username,
      email,
      password,
      preferences: {
        favoriteGenres: [],
        favoriteArtists: [],
        mood: 'happy'
      }
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', email);
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('listeningHistory.songId');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('listeningHistory.songId');

    // Get top genres from listening history
    const topGenres = await User.aggregate([
      { $match: { _id: req.user._id } },
      { $unwind: '$listeningHistory' },
      {
        $lookup: {
          from: 'songs',
          localField: 'listeningHistory.songId',
          foreignField: '_id',
          as: 'song'
        }
      },
      { $unwind: '$song' },
      { $group: { _id: '$song.genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get total playlists
    const totalPlaylists = await require('../models/Playlist').countDocuments({
      owner: req.user._id
    });

    res.json({
      user,
      topGenres,
      totalPlaylists,
      totalSongsPlayed: user.listeningHistory?.length || 0
    });
  } catch (error) {
    next(error);
  }
};


exports.updatePreferences = async (req, res, next) => {
  try {
    const { favoriteGenres, favoriteArtists, mood } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        preferences: {
          favoriteGenres,
          favoriteArtists,
          mood
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

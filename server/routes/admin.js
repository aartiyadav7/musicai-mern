const express = require('express');
const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const router = express.Router();

// Get admin stats
router.get('/stats', async (req, res, next) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();

    const topSongs = await Song.find()
      .sort({ plays: -1 })
      .limit(10)
      .select('title artist plays');

    const genreStats = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalSongs,
      totalUsers,
      totalPlaylists,
      topSongs,
      genreStats
    });
  } catch (error) {
    next(error);
  }
});

// Seed database endpoint (one-time use)
router.get('/seed', async (req, res, next) => {
  try {
    // Import sample songs from seed.js
    const { sampleSongs } = require('../seed');

    // Clear existing songs
    await Song.deleteMany({});

    // Insert sample songs
    await Song.insertMany(sampleSongs);

    res.json({
      success: true,
      message: `Seeded ${sampleSongs.length} songs successfully!`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

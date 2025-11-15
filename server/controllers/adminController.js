const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');

exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalSongs, totalUsers, totalPlaylists, recentSongs] = await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Playlist.countDocuments(),
      Song.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Get genre distribution
    const genreStats = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get mood distribution
    const moodStats = await Song.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most played songs
    const topSongs = await Song.find()
      .sort({ plays: -1 })
      .limit(5)
      .select('title artist plays');

    res.json({
      totalSongs,
      totalUsers,
      totalPlaylists,
      genreStats,
      moodStats,
      topSongs,
      recentSongs
    });
  } catch (error) {
    next(error);
  }
};

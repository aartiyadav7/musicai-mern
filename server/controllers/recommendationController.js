const Recommendation = require('../models/Recommendation');
const Song = require('../models/Song');
const User = require('../models/User');
const aiService = require('../services/aiRecommendation');

exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('listeningHistory.songId');

    // Get recent songs (with safety checks)
    const recentSongs = user.listeningHistory
      ?.slice(-10)
      ?.map(h => h.songId)
      ?.filter(s => s) || [];

    // Generate AI recommendations
    const aiRecommendations = await aiService.generateRecommendations(user, {
      mood: req.query.mood || user.preferences?.mood,
      recentSongs,
      preferences: user.preferences
    });

    // Only save to database if there are songs
    if (aiRecommendations.songs.length > 0) {
      try {
        const recommendation = new Recommendation({
          userId: user._id,
          songs: aiRecommendations.songs.map(s => s._id),
          reason: aiRecommendations.reason,
          basedOn: aiRecommendations.basedOn || 'user preferences'  // ← Fallback value
        });

        await recommendation.save();
      } catch (saveError) {
        // If save fails, just log it but still return recommendations
        console.warn('Failed to save recommendation:', saveError.message);
      }
    }

    res.json({
      songs: aiRecommendations.songs,
      reason: aiRecommendations.reason,
      basedOn: aiRecommendations.basedOn
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    next(error);
  }
};

exports.getRecommendationsByMood = async (req, res, next) => {
  try {
    const { mood } = req.params;

    const songs = await Song.find({ mood })
      .sort({ plays: -1 })
      .limit(20);

    res.json({
      songs,
      reason: `Songs perfect for a ${mood} mood`,
      basedOn: 'mood'
    });
  } catch (error) {
    console.error('Get recommendations by mood error:', error);
    next(error);
  }
};

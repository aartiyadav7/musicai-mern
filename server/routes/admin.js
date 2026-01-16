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
    // Sample songs data
    const sampleSongs = [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        genre: "Pop",
        duration: 200,
        releaseYear: 2020,
        coverImage: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        plays: 1500,
        mood: "energetic",
        tags: ["pop", "synth", "80s"]
      },
      {
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷",
        genre: "Pop",
        duration: 234,
        releaseYear: 2017,
        coverImage: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        plays: 1200,
        mood: "happy",
        tags: ["pop", "dance"]
      },
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        genre: "Rock",
        duration: 354,
        releaseYear: 1975,
        coverImage: "https://i.scdn.co/image/ab67616d0000b2731e02064f0a8cb91b8a5a1b94",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        plays: 2000,
        mood: "calm",
        tags: ["rock", "classic", "opera"]
      }
    ];

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

const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Song = require('../models/Song');  // ← Fixed: models (plural) not model

const router = express.Router();

// Get all favorite songs for current user
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favoriteSongs');
    res.json(user.favoriteSongs || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Failed to get favorites' });
  }
});

// Check if a song is favorited
router.get('/check/:songId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const isFavorite = user.favoriteSongs?.includes(req.params.songId);
    res.json({ isFavorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Failed to check favorite status' });
  }
});

// Add song to favorites
router.post('/:songId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.songId;
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Initialize favoriteSongs array if it doesn't exist
    if (!user.favoriteSongs) {
      user.favoriteSongs = [];
    }
    
    // Check if already favorited
    if (user.favoriteSongs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in favorites' });
    }
    
    // Add to favorites
    user.favoriteSongs.push(songId);
    await user.save();
    
    res.json({ 
      message: 'Added to favorites',
      isFavorite: true,
      favoriteSongs: user.favoriteSongs
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
});

// Remove song from favorites
router.delete('/:songId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.songId;
    
    if (!user.favoriteSongs) {
      return res.status(400).json({ message: 'No favorites to remove' });
    }
    
    // Remove from favorites
    user.favoriteSongs = user.favoriteSongs.filter(
      id => id.toString() !== songId
    );
    
    await user.save();
    
    res.json({ 
      message: 'Removed from favorites',
      isFavorite: false,
      favoriteSongs: user.favoriteSongs
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});

// Toggle favorite (add if not exist, remove if exists) - RECOMMENDED
router.put('/toggle/:songId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.songId;
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Initialize favoriteSongs array if it doesn't exist
    if (!user.favoriteSongs) {
      user.favoriteSongs = [];
    }
    
    const isFavorite = user.favoriteSongs.some(id => id.toString() === songId);
    
    if (isFavorite) {
      // Remove from favorites
      user.favoriteSongs = user.favoriteSongs.filter(
        id => id.toString() !== songId
      );
      await user.save();
      res.json({ 
        message: 'Removed from favorites',
        isFavorite: false
      });
    } else {
      // Add to favorites
      user.favoriteSongs.push(songId);
      await user.save();
      res.json({ 
        message: 'Added to favorites',
        isFavorite: true
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Failed to toggle favorite' });
  }
});

module.exports = router;

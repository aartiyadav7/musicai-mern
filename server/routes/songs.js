const express = require('express');
const songController = require('../controllers/songController');
const router = express.Router();

// Public routes
router.get('/', songController.getAllSongs);
router.get('/search', songController.searchSongs);
router.get('/genres', songController.getGenres);
router.get('/:id', songController.getSongById);

// Track play - no auth required
router.post('/:id/play', songController.incrementPlay);

// CRUD operations - NO AUTH
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

module.exports = router;

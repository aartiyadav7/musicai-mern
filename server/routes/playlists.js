const express = require('express');
const playlistController = require('../controllers/playlistController');
const { auth } = require('../middleware/auth');  // ← Use destructuring

const router = express.Router();

router.post('/', auth, playlistController.createPlaylist);
router.get('/', auth, playlistController.getUserPlaylists);
router.get('/:id', auth, playlistController.getPlaylistById);
router.put('/:id', auth, playlistController.updatePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);
router.post('/:id/songs', auth, playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', auth, playlistController.removeSongFromPlaylist);

module.exports = router;

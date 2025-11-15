const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      owner: req.user._id,
      isPublic,
      songs: []
    });

    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs')
      .sort({ updatedAt: -1 });

    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

exports.getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'username');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $pull: { songs: songId } },
      { new: true }
    ).populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.updatePlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { 
        name, 
        description, 
        isPublic,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

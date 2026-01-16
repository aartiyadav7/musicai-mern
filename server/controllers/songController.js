const Song = require('../models/Song');
const User = require('../models/User');

exports.getAllSongs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, mood, search } = req.query;

    const query = {};
    
    if (genre) {
      query.genre = genre;
    }
    if (mood){
      query.mood = mood;  
    }
    if (search) {
      query.$text = { $search: search };
    }

    const songs = await Song.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Song.countDocuments(query);

    res.json({
      songs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    next(error);
  }
};

exports.searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const songs = await Song.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { artist: new RegExp(q, 'i') },
        { album: new RegExp(q, 'i') }
      ]
    }).limit(20);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

exports.incrementPlay = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Only add to listening history if user is authenticated
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          listeningHistory: {
            songId: song._id,
            playedAt: new Date()
          }
        }
      });
    }

    res.json(song);
  } catch (error) {
    console.error('Increment play error:', error);
    next(error);
  }
};

exports.getGenres = async (req, res, next) => {
  try {
    const genres = await Song.distinct('genre');
    res.json(genres);
  } catch (error) {
    next(error);
  }
};

exports.createSong = async (req, res, next) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
};

exports.updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    next(error);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};

import React, { useEffect, useState } from 'react';
import { FiPlus, FiMusic, FiUsers, FiList, FiTrendingUp, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const [songs, setSongs] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    mood: '',
    duration: '',
    audioUrl: '',
    coverImage: ''
  });

  useEffect(() => {
    fetchStats();
    fetchSongs();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await api.get('/songs?limit=100');
      setSongs(response.data.songs || []);
    } catch (error) {
      toast.error('Failed to fetch songs');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setEditingSong(null);
    setFormData({
      title: '',
      artist: '',
      genre: '',
      mood: '',
      duration: '',
      audioUrl: '',
      coverImage: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSong) {
        await api.put(`/songs/${editingSong._id}`, formData);
        toast.success('Song updated!');
      } else {
        await api.post('/songs', formData);
        toast.success('Song added!');
      }
      resetForm();
      setShowModal(false);
      fetchSongs();
      fetchStats();
    } catch (error) {
      toast.error('Failed to save song');
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      mood: song.mood,
      duration: song.duration,
      audioUrl: song.audioUrl,
      coverImage: song.coverImage
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await api.delete(`/songs/${id}`);
      toast.success('Song deleted!');
      fetchSongs();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete song');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your music library</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            <FiPlus className="text-xl" />
            <span>Add Song</span>
          </button>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <FiMusic className="text-4xl text-primary-400" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalSongs}</h3>
              <p className="text-gray-400">Songs</p>
            </div>

            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <FiUsers className="text-4xl text-purple-400" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalUsers}</h3>
              <p className="text-gray-400">Users</p>
            </div>

            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <FiList className="text-4xl text-pink-400" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalPlaylists}</h3>
              <p className="text-gray-400">Playlists</p>
            </div>
          </div>
        )}

        {/* Top Songs & Recent Activity */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Most Played Songs */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-primary-400" />
                Top Played Songs
              </h3>
              <div className="space-y-3">
                {stats.topSongs.map((song, index) => (
                  <div key={song._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-mono">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                    <span className="text-primary-400">{song.plays} plays</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-xl font-bold mb-4">Genre Distribution</h3>
              <div className="space-y-3">
                {stats.genreStats.slice(0, 5).map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <span className="font-medium">{stat._id}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(stat.count / stats.totalSongs) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-12 text-right">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Songs Table */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-700">
            <h2 className="text-xl font-bold">All Songs ({songs.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Mood
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plays
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {songs.map((song) => (
                  <tr key={song._id} className="hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <span className="font-medium">{song.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {song.artist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-primary-600 bg-opacity-20 text-primary-400 rounded-full text-xs">
                        {song.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-400">
                      {song.mood}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {song.plays || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleEdit(song)}
                        className="text-primary-400 hover:text-primary-300 mr-4"
                      >
                        <FiEdit2 className="inline text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 className="inline text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingSong ? 'Edit Song' : 'Add New Song'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  />
                  <input
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    placeholder="Artist"
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  />
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  >
                    <option value="">Select Genre</option>
                    {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Indie'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <select
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  >
                    <option value="">Select Mood</option>
                    {['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'focus'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration (seconds)"
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  />
                  <input
                    name="audioUrl"
                    type="url"
                    value={formData.audioUrl}
                    onChange={handleChange}
                    placeholder="Audio URL"
                    required
                    className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                  />
                </div>
                <input
                  name="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Cover Image URL"
                  required
                  className="w-full p-3 rounded bg-dark-900 border border-dark-700"
                />
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-primary-600 hover:bg-primary-700"
                  >
                    {editingSong ? 'Update' : 'Add'} Song
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

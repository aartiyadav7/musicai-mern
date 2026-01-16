import React, { useEffect, useState } from 'react';
import { FiPlus, FiMusic, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Library = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchPlaylists();
  }, [isAuthenticated]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Fetch playlists error:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      if (editingPlaylist) {
        // UPDATE
        await api.put(`/playlists/${editingPlaylist._id}`, {
          name: formData.name,
          description: formData.description,
          isPublic: true
        });
        toast.success('Playlist updated!');
      } else {
        // CREATE
        await api.post('/playlists', {
          name: formData.name,
          description: formData.description,
          isPublic: true
        });
        toast.success('Playlist created!');
      }
      
      resetForm();
      setShowModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Save playlist error:', error);
      toast.error('Failed to save playlist');
    }
  };

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      await api.delete(`/playlists/${playlistId}`);
      toast.success('Playlist deleted!');
      fetchPlaylists();
    } catch (error) {
      console.error('Delete playlist error:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const resetForm = () => {
    setEditingPlaylist(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Library</h1>
            <p className="text-gray-400">Manage your playlists and collections</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            <FiPlus className="text-xl" />
            <span>Create Playlist</span>
          </button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="group relative bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-all">
                <img
                  src={playlist.coverImage}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {playlist.songs?.length || 0} songs
                </p>

                {/* Edit & Delete Buttons */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                  <button
                    onClick={() => handleEdit(playlist)}
                    className="p-2 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full hover:bg-primary-600 transition-all"
                  >
                    <FiEdit2 className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(playlist._id)}
                    className="p-2 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full hover:bg-red-600 transition-all"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiMusic className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-gray-400 mb-6">Create your first playlist to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
            >
              Create Playlist
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Describe your playlist..."
                  rows="3"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  {editingPlaylist ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

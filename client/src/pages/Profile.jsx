import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiMusic, FiHeart, FiClock } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser, isAuthenticated, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(authUser);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState('');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [saving, setSaving] = useState(false);

  const availableGenres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Indie', 'Metal'];
  const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'focus'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);

      if (response.data?.preferences) {
        setSelectedGenres(response.data.preferences.favoriteGenres || []);
        setSelectedArtists(response.data.preferences.favoriteArtists?.join(', ') || '');
        setSelectedMood(response.data.preferences.mood || 'happy');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const artistsArray = selectedArtists
        .split(',')
        .map(a => a.trim())
        .filter(a => a);

      await updatePreferences({
        favoriteGenres: selectedGenres,
        favoriteArtists: artistsArray,
        mood: selectedMood
      });

      // Refresh profile to get updated data
      await fetchUserProfile();
      
      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Save preferences error:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <FiUser className="text-5xl text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <div className="flex items-center space-x-2 text-white/90">
                <FiMail className="text-lg" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <FiMusic className="text-3xl text-primary-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {user.listeningHistory?.length || 0}
            </h3>
            <p className="text-gray-400">Songs Played</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <FiHeart className="text-3xl text-pink-400 mb-2" />
            <h3 className="text-2xl font-bold">
              {selectedGenres.length}
            </h3>
            <p className="text-gray-400">Favorite Genres</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <FiClock className="text-3xl text-purple-400 mb-2" />
            <h3 className="text-2xl font-bold capitalize">{selectedMood}</h3>
            <p className="text-gray-400">Current Mood</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h2 className="text-2xl font-bold mb-6">Music Preferences</h2>

          {/* Favorite Genres */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">Favorite Genres</label>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Artists */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">Favorite Artists</label>
            <input
              type="text"
              value={selectedArtists}
              onChange={(e) => setSelectedArtists(e.target.value)}
              placeholder="Enter artists separated by commas (e.g., The Beatles, Queen, Pink Floyd)"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500"
            />
            <p className="text-sm text-gray-400 mt-2">
              Separate multiple artists with commas
            </p>
          </div>

          {/* Current Mood */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">Current Mood</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-full capitalize transition-colors ${
                    selectedMood === mood
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

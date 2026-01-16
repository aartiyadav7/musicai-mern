import React, { useEffect, useState } from 'react';
import { FiRefreshCw, FiFilter, FiMusic } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import RecommendationCard from '../components/RecommendationCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import toast from 'react-hot-toast';

const Discover = () => {
  const { isAuthenticated } = useAuth();
  const { playSong } = useMusic();

  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'focus'];

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Read search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    }
  }, []);

  // Fetch songs when filters or searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchSongs();
    }
  }, [selectedGenre, selectedMood, searchQuery]);

  // Fetch genres from backend
  const fetchGenres = async () => {
    try {
      const response = await api.get('/songs/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Fetch genres error:', error);
      toast.error('Failed to load genres');
    }
  };

  // Fetch songs with filters
  const fetchSongs = async () => {
    try {
      setLoading(true);
      let params = [];
      if (selectedGenre) params.push(`genre=${encodeURIComponent(selectedGenre)}`);
      if (selectedMood) params.push(`mood=${encodeURIComponent(selectedMood)}`);

      const queryString = params.length > 0 ? `?${params.join('&')}&limit=100` : '?limit=100';
      const response = await api.get(`/songs${queryString}`);

      setSongs(response.data.songs || []);
    } catch (error) {
      console.error('Fetch songs error:', error);
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  // Search songs by query
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const response = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
      setSongs(response.data);
      toast.success(`Found ${response.data.length} songs`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI recommendations from backend
  const handleRefreshRecommendations = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to get personalized recommendations');
      return;
    }

    try {
      setRefreshing(true);
      const response = await api.get('/recommendations', {
        params: { mood: selectedMood }
      });
      setSongs(response.data.songs || []);
      toast.success('AI recommendations loaded!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error(error.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setRefreshing(false);
    }
  };

  // Play song with queue
  const handleSongClick = (song) => {
    console.log('Discover - Queuesize:', songs.length);
    playSong(song, songs);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-dark-800 to-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Music</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="text-xl text-gray-400" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>
            <button
              onClick={handleRefreshRecommendations}
              disabled={refreshing || !isAuthenticated}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <FiRefreshCw className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
              <span>AI Recommendations</span>
            </button>
          </div>

          {/* Genre Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  !selectedGenre
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedGenre === genre
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mood</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMood('')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  !selectedMood
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                }`}
              >
                All Moods
              </button>
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-full capitalize transition-colors ${
                    selectedMood === mood
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Songs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-400">Loading songs...</p>
          </div>
        ) : songs.length > 0 ? (
          <>
            <p className="text-gray-400 mb-4">{songs.length} songs found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {songs.map((song) => (
                <div key={song._id} onClick={() => handleSongClick(song)}>
                  <RecommendationCard song={song} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FiMusic className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No songs found</h3>
            <p className="text-gray-400 mb-6">
              {selectedGenre || selectedMood
                ? 'Try different filters or clear them to see all songs.'
                : 'The database is empty. Please run the seed script to add sample songs.'}
            </p>
            <div className="bg-dark-800 rounded-lg p-6 max-w-md mx-auto text-left">
              <p className="text-sm text-gray-400 mb-2">To add sample songs, run:</p>
              <code className="block bg-dark-900 p-3 rounded text-primary-400 text-sm">
                cd server<br />
                node seed.js
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;

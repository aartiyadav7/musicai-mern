import React, { useState, useEffect } from 'react';
import { FiPlay, FiPlus, FiPause, FiHeart } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const RecommendationCard = ({ song, showAddButton = true }) => {
  const { playSong, currentSong, isPlaying } = useMusic();
  const { isAuthenticated } = useAuth();
  const isCurrentSong = currentSong?._id === song._id;
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if song is favorited on mount
  useEffect(() => {
    if (isAuthenticated && song._id) {
      checkFavoriteStatus();
    }
  }, [song._id, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get(`/favorites/check/${song._id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      // Silently fail
    }
  };

  const handleAddClick = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add songs to playlists');
      return;
    }
    
    try {
      const response = await api.get('/playlists');
      setPlaylists(response.data);
      setShowPlaylistModal(true);
    } catch (error) {
      toast.error('Failed to load playlists');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await api.post(`/playlists/${playlistId}/songs`, { songId: song._id });
      toast.success('Song added to playlist!');
      setShowPlaylistModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add song');
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }
    
    try {
      const response = await api.put(`/favorites/toggle/${song._id}`);
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    playSong(song);
    
    if (isAuthenticated) {
      try {
        api.post(`/songs/${song._id}/play`);
      } catch (error) {
        console.error('Failed to track play:', error);
      }
    }
  };

  return (
    <>
      <div className="group relative bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-all cursor-pointer">
        <div className="relative mb-4">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all p-4 bg-primary-600 hover:bg-primary-700 rounded-full"
            >
              {isCurrentSong && isPlaying ? (
                <FiPause className="text-2xl" />
              ) : (
                <FiPlay className="text-2xl ml-0.5" />
              )}
            </button>
          </div>

          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full text-xs font-medium">
              {song.genre}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold truncate group-hover:text-primary-400 transition-colors">
            {song.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          {song.album && (
            <p className="text-xs text-gray-500 truncate">{song.album}</p>
          )}
        </div>

        {/* Favorite Heart Button */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleFavoriteClick}
            className={`p-2 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full hover:bg-red-600 transition-all ${
              isFavorite ? 'text-red-500' : ''
            }`}
          >
            <FiHeart className="text-lg" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Add to Playlist Button */}
        {showAddButton && (
          <button 
            onClick={handleAddClick}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full hover:bg-primary-600 transition-all"
          >
            <FiPlus className="text-lg" />
          </button>
        )}
      </div>

      {/* Playlist Selection Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add to Playlist</h3>
            {playlists.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {playlists.map(playlist => (
                  <button
                    key={playlist._id}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                    className="w-full p-3 bg-dark-700 hover:bg-primary-600 rounded-lg text-left transition-colors flex items-center justify-between"
                  >
                    <span>{playlist.name}</span>
                    <span className="text-sm text-gray-400">{playlist.songs?.length || 0} songs</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No playlists yet. Create one first!</p>
                <a href="/library" className="text-primary-400 hover:underline">Go to Library</a>
              </div>
            )}
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendationCard;

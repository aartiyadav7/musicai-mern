import React, { useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    changeVolume,
  } = useMusic();

  const { isAuthenticated } = useAuth();
  const progressBarRef = useRef(null);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }
    
    if (!currentSong?._id) return;

    try {
      await api.put(`/favorites/toggle/${currentSong._id}`);
      toast.success('Favorite updated!');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 px-4 py-3 z-50">
      <div className="max-w-screen-2xl mx-auto">
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="w-full h-1 bg-dark-700 rounded-full cursor-pointer mb-3 group"
        >
          <div
            className="h-full bg-primary-600 rounded-full relative group-hover:bg-primary-500 transition-colors"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold truncate">{currentSong.title}</h4>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={handleFavorite}
              className="p-2 hover:text-red-500 transition-colors"
              disabled={!isAuthenticated}
            >
              <FiHeart className="text-xl" />
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              {/* Previous Button */}
              <button
                onClick={playPrevious}
                className="p-2 hover:text-primary-400 transition-colors"
                aria-label="Previous song"
              >
                <FiSkipBack className="text-2xl" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="p-3 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <FiPause className="text-2xl" />
                ) : (
                  <FiPlay className="text-2xl ml-0.5" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={playNext}
                className="p-2 hover:text-primary-400 transition-colors"
                aria-label="Next song"
              >
                <FiSkipForward className="text-2xl" />
              </button>
            </div>

            {/* Time Display */}
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <FiVolume2 className="text-xl" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-primary-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

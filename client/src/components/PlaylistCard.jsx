import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMusic, FiLock } from 'react-icons/fi';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  const songCount = playlist.songs?.length || 0;

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="group relative bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-all cursor-pointer"
    >
      <div className="relative mb-4">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.name}
            className="w-full aspect-square object-cover rounded-lg"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop';
            }}
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FiMusic className="text-6xl text-white opacity-50" />
          </div>
        )}
        
        {!playlist.isPublic && (
          <div className="absolute top-2 left-2">
            <div className="p-1.5 bg-dark-900 bg-opacity-80 backdrop-blur-sm rounded-full">
              <FiLock className="text-sm" />
            </div>
          </div>
        )}
        
        {/* Play button on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all p-4 bg-primary-600 hover:bg-primary-700 rounded-full">
            <FiMusic className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold truncate group-hover:text-primary-400 transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-400">
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;

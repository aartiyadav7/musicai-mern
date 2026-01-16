import React, { useEffect, useState } from 'react';
import { FiHeart, FiMusic } from 'react-icons/fi';
import RecommendationCard from '../components/RecommendationCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Fetch favorites error:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-gradient-to-b from-dark-800 to-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <FiHeart className="text-4xl text-red-500" fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold">Favorite Songs</h1>
          </div>
          <p className="text-gray-400">Your liked songs collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-400">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <p className="text-gray-400 mb-4">{favorites.length} favorite songs</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {favorites.map((song) => (
                <RecommendationCard key={song._id} song={song} showAddButton={true} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FiMusic className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-6">
              Start adding songs to your favorites by clicking the heart icon!
            </p>
            <a 
              href="/discover" 
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
            >
              Discover Music
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

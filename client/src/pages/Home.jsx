import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiMusic, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Hero from '../components/Hero';
import RecommendationCard from '../components/RecommendationCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { playSong } = useMusic();
  const [popularSongs, setPopularSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch popular songs
      const songsResponse = await api.get('/songs?limit=12');
      setPopularSongs(songsResponse.data.songs || []);

      // Fetch AI recommendations if authenticated
      if (isAuthenticated) {
        try {
          const recResponse = await api.get('/recommendations');
          setRecommendations(recResponse.data.songs || []);
        } catch (error) {
          console.error('Recommendations error:', error);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSongClick = (song, songList) => {
    console.log('Home - Queue size:', songList.length);
    playSong(song, songList);
  };

  return (
    <div className="min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AI Recommendations Section */}
        {isAuthenticated && recommendations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FiStar className="text-3xl text-primary-400" />
                <h2 className="text-3xl font-bold">Made For You</h2>
              </div>
              <Link
                to="/discover"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                See All
              </Link>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered recommendations based on your listening history
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.slice(0, 8).map((song) => (
                <div key={song._id} onClick={() => handleSongClick(song, recommendations)}>
                  <RecommendationCard song={song} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Songs Section with Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FiTrendingUp className="text-3xl text-purple-400" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <Link
              to="/discover"
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Explore More
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="relative group">
              {/* Left Navigation Button */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-dark-800 hover:bg-primary-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all -ml-6"
                aria-label="Scroll left"
              >
                <FiChevronLeft className="text-2xl" />
              </button>

              {/* Songs Carousel */}
              <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              >
                {popularSongs.map((song) => (
                  <div 
                    key={song._id} 
                    className="flex-shrink-0 w-56"
                    onClick={() => handleSongClick(song, popularSongs)}
                  >
                    <RecommendationCard song={song} />
                  </div>
                ))}
              </div>

              {/* Right Navigation Button */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-dark-800 hover:bg-primary-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all -mr-6"
                aria-label="Scroll right"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MusicAI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-dark-800 rounded-xl border border-dark-700">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-400">
                Our advanced AI learns your preferences and suggests songs you'll love
              </p>
            </div>

            <div className="text-center p-8 bg-dark-800 rounded-xl border border-dark-700">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMusic className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vast Library</h3>
              <p className="text-gray-400">
                Access thousands of songs across all genres and moods
              </p>
            </div>

            <div className="text-center p-8 bg-dark-800 rounded-xl border border-dark-700">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized</h3>
              <p className="text-gray-400">
                Every recommendation is tailored to your unique taste
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

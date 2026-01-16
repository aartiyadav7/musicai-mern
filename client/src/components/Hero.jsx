import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiStar, FiTrendingUp, FiMusic } from 'react-icons/fi';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-800 via-dark-900 to-dark-900">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discover Your Next
            <br />
            Favorite Song
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered music recommendations tailored just for you. 
            Let our intelligent system understand your taste and mood.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/discover"
              className="group flex items-center space-x-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
            >
              <FiPlay className="text-xl group-hover:animate-pulse" />
              <span>Start Listening</span>
            </Link>
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-8 py-4 bg-dark-700 hover:bg-dark-600 rounded-full text-lg font-semibold transition-all"
            >
              <FiStar className="text-xl" />
              <span>Get Started Free</span>
            </Link>
          </div>

          {/* Stats - NOW CLICKABLE */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link
              to="/discover"
              className="p-6 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700 hover:border-primary-500 hover:bg-dark-800 transition-all cursor-pointer group"
            >
              <FiMusic className="text-4xl text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold text-white">10K+</h3>
              <p className="text-gray-400">Songs Available</p>
            </Link>

            <Link
              to="/profile"
              className="p-6 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700 hover:border-purple-500 hover:bg-dark-800 transition-all cursor-pointer group"
            >
              <FiStar className="text-4xl text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold text-white">AI-Powered</h3>
              <p className="text-gray-400">Smart Recommendations</p>
            </Link>

            <Link
              to="/auth"
              className="p-6 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700 hover:border-pink-500 hover:bg-dark-800 transition-all cursor-pointer group"
            >
              <FiTrendingUp className="text-4xl text-pink-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold text-white">Personalized</h3>
              <p className="text-gray-400">Just For You</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

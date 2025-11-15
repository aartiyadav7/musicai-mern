import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // If onSearch prop exists, use it (for Discover page)
      if (onSearch) {
        onSearch(query);
      } else {
        // Navigate to discover with search query
        navigate(`/discover?search=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-full focus:outline-none focus:border-primary-500 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-full font-medium transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

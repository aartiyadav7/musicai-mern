// client/src/pages/Playlist.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const Playlist = () => {
  const { id } = useParams();
  return (
    <div className="p-6 text-white">
      <h1>Playlist ID: {id}</h1>
      <p>Playlist details coming soon...</p>
    </div>
  );
};

export default Playlist;

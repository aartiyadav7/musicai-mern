import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import ErrorBoundary from './components/ErrorBoundary';  

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Playlist from './pages/Playlist';
import Favorites from './pages/Favorites';

// Components
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
  <ErrorBoundary> 
    <AuthProvider>
      <MusicProvider>
        <Router>
          <div className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <main className="pb-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/library" element={<Library />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/playlist/:id" element={<Playlist />} />
              </Routes>
            </main>
            <MusicPlayer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#282828',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </MusicProvider>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;

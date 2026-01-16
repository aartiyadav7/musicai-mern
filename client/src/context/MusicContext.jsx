import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  // Initialize Audio object only once
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const playSong = useCallback((song, songQueue = []) => {
    console.log('[MusicContext] playSong called - target:', song.title);
    setCurrentSong(song);
    setIsPlaying(true);

    if (songQueue.length > 0) {
      setQueue(songQueue);
      const index = songQueue.findIndex(s => s._id === song._id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      setQueue([song]);
      setCurrentIndex(0);
    }
  }, []);

  const togglePlay = useCallback(() => {
    console.log('[MusicContext] togglePlay from', isPlaying, 'to', !isPlaying);
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    console.log('[MusicContext] playNext index:', nextIndex);
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    console.log('[MusicContext] playPrevious index:', prevIndex);
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  const addToQueue = useCallback((songs) => {
    setQueue(prevQueue => [...prevQueue, ...songs]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Sync audio source when song changes
  useEffect(() => {
    if (currentSong && currentSong.audioUrl) {
      console.log('[MusicContext] Loading new audio URL:', currentSong.audioUrl);
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.load();
      }
    }
  }, [currentSong]);

  // Sync play/pause state
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    if (isPlaying) {
      console.log('[MusicContext] Attempting to play...');
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('[MusicContext] Playback failed:', error.message);
          setIsPlaying(false); // Revert UI state on failure
        });
      }
    } else {
      console.log('[MusicContext] Pausing...');
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      console.log('[MusicContext] Metadata loaded. Duration:', audio.duration);
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      console.log('[MusicContext] Song ended naturally');
      playNext();
    };
    const handleError = (e) => {
      console.error('[MusicContext] Audio element error:', e);
      toast?.error?.('Audio playback error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playNext]);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        queue,
        currentIndex,
        audioRef,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        changeVolume,
        addToQueue,
        clearQueue
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

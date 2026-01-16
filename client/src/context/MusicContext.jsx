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
    console.log('[MusicContext] playSong:', song.title);

    // 1. Update State
    setCurrentSong(song);
    setIsPlaying(true);

    // 2. Queue Logic
    if (songQueue.length > 0) {
      setQueue(songQueue);
      const index = songQueue.findIndex(s => s._id === song._id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      setQueue([song]);
      setCurrentIndex(0);
    }

    // 3. Direct Audio Control (Crucial for browser autoplay policy)
    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('[MusicContext] Playback failed:', error.message);
          setIsPlaying(false);
          toast?.error?.('Click Play again to start music');
        });
      }
      toast?.success?.(`Playing: ${song.title}`);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      console.log('[MusicContext] Pausing');
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log('[MusicContext] Playing');
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('[MusicContext] Play failed:', error.message);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    console.log('[MusicContext] Next:', nextSong.title);

    setCurrentIndex(nextIndex);
    setCurrentSong(nextSong);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = nextSong.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error('Next play error:', e));
    }
  }, [queue, currentIndex]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    const prevSong = queue[prevIndex];
    console.log('[MusicContext] Previous:', prevSong.title);

    setCurrentIndex(prevIndex);
    setCurrentSong(prevSong);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = prevSong.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error('Prev play error:', e));
    }
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

  // Use effects ONLY for volume and event listeners, not play/pause logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();
    const handleError = (e) => {
      console.error('[MusicContext] Audio Error:', e);
      setIsPlaying(false);
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

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
  const audioRef = useRef(new Audio());

  const playSong = useCallback((song, songQueue = []) => {
    console.log('Playing:', song.title);
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (songQueue.length > 0) {
      setQueue(songQueue);
      const index = songQueue.findIndex(s => s._id === song._id);
      setCurrentIndex(index !== -1 ? index : 0);
      console.log('Queue set:', songQueue.length, 'songs, index:', index);
    } else {
      // Create queue with just this song
      setQueue([song]);
      setCurrentIndex(0);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Play error:', err));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (queue.length === 0) {
      console.log('No queue available');
      return;
    }
    
    const nextIndex = (currentIndex + 1) % queue.length;
    console.log('Next song:', nextIndex, queue[nextIndex]?.title);
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) {
      console.log('No queue available');
      return;
    }
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    console.log('Previous song:', prevIndex, queue[prevIndex]?.title);
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  }, [queue, currentIndex]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  }, []);

  const addToQueue = useCallback((songs) => {
    setQueue(prevQueue => [...prevQueue, ...songs]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Update audio source when song changes
  useEffect(() => {
    if (currentSong && currentSong.audioUrl) {
      console.log('Loading audio:', currentSong.audioUrl);
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.volume = volume;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Autoplay error:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // Handle play/pause state
  useEffect(() => {
    if (currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Play error:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      console.log('Song ended, playing next');
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext]); // ← Added playNext as dependency

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

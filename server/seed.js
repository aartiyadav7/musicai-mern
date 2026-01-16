require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('./models/Song');

const sampleSongs = [
  // Pop Songs
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    duration: 200,
    releaseYear: 2020,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    mood: "energetic",
    tags: ["pop", "synth", "80s"]
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    genre: "Pop",
    duration: 203,
    releaseYear: 2020,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    mood: "party",
    tags: ["disco", "dance", "upbeat"]
  },
  
  // Rock Songs
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    genre: "Rock",
    duration: 354,
    releaseYear: 1975,
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    mood: "energetic",
    tags: ["classic rock", "opera", "epic"]
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    genre: "Rock",
    duration: 482,
    releaseYear: 1971,
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    mood: "calm",
    tags: ["classic rock", "ballad"]
  },

  // Hip Hop Songs
  {
    title: "HUMBLE.",
    artist: "Kendrick Lamar",
    album: "DAMN.",
    genre: "Hip Hop",
    duration: 177,
    releaseYear: 2017,
    coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    mood: "energetic",
    tags: ["rap", "hip hop", "trap"]
  },
  {
    title: "Sicko Mode",
    artist: "Travis Scott",
    album: "ASTROWORLD",
    genre: "Hip Hop",
    duration: 312,
    releaseYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    mood: "party",
    tags: ["trap", "hip hop"]
  },

  // Electronic Songs
  {
    title: "Strobe",
    artist: "Deadmau5",
    album: "For Lack of a Better Name",
    genre: "Electronic",
    duration: 640,
    releaseYear: 2009,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    mood: "focus",
    tags: ["progressive house", "electronic"]
  },
  {
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    genre: "Electronic",
    duration: 244,
    releaseYear: 2011,
    coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    mood: "energetic",
    tags: ["synth pop", "electronic"]
  },

  // Jazz Songs
  {
    title: "Take Five",
    artist: "Dave Brubeck",
    album: "Time Out",
    genre: "Jazz",
    duration: 324,
    releaseYear: 1959,
    coverImage: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    mood: "calm",
    tags: ["cool jazz", "instrumental"]
  },
  {
    title: "So What",
    artist: "Miles Davis",
    album: "Kind of Blue",
    genre: "Jazz",
    duration: 563,
    releaseYear: 1959,
    coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    mood: "calm",
    tags: ["modal jazz", "trumpet"]
  },

  // R&B Songs
  {
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    genre: "R&B",
    duration: 327,
    releaseYear: 2016,
    coverImage: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    mood: "romantic",
    tags: ["funk", "soul", "psychedelic"]
  },
  {
    title: "Finesse",
    artist: "Bruno Mars",
    album: "24K Magic",
    genre: "R&B",
    duration: 218,
    releaseYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    mood: "party",
    tags: ["funk", "new jack swing"]
  },

  // Indie Songs
  {
    title: "Electric Feel",
    artist: "MGMT",
    album: "Oracular Spectacular",
    genre: "Indie",
    duration: 229,
    releaseYear: 2008,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    mood: "happy",
    tags: ["psychedelic pop", "indie"]
  },
  {
    title: "Somebody That I Used to Know",
    artist: "Gotye",
    album: "Making Mirrors",
    genre: "Indie",
    duration: 244,
    releaseYear: 2011,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    mood: "sad",
    tags: ["indie pop", "alternative"]
  },

  // Classical Songs
  {
    title: "Clair de Lune",
    artist: "Claude Debussy",
    album: "Suite Bergamasque",
    genre: "Classical",
    duration: 300,
    releaseYear: 1905,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    mood: "calm",
    tags: ["piano", "impressionist"]
  },
  {
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    album: "Piano Sonata No. 14",
    genre: "Classical",
    duration: 360,
    releaseYear: 1801,
    coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    mood: "focus",
    tags: ["piano", "romantic era"]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Song.deleteMany({});
    console.log('🗑️  Cleared existing songs');

    await Song.insertMany(sampleSongs);
    console.log(`✅ Added ${sampleSongs.length} sample songs to database`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now:');
    console.log('1. Browse songs on the Discover page');
    console.log('2. Get AI recommendations');
    console.log('3. Create playlists');
    console.log('4. Play music!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

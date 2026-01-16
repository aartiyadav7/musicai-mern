const { GoogleGenerativeAI } = require('@google/generative-ai');
const Song = require('../models/Song');

class AIRecommendationService {
  constructor() {
    // Only initialize if API key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
        this.hasAPIKey = true;
        console.log('✅ Gemini AI initialized');
      } catch (error) {
        console.warn('⚠️  Failed to initialize Gemini client:', error.message);
        this.hasAPIKey = false;
      }
    } else {
      console.warn('⚠️  GEMINI_API_KEY not found - using fallback recommendations');
      this.hasAPIKey = false;
    }
  }

  async generateRecommendations(user, context = {}) {
    // If no API key, use fallback immediately
    if (!this.hasAPIKey || !this.model) {
      console.log('📊 Using fallback recommendations');
      return this.getFallbackRecommendations(user, context);
    }

    try {
      const prompt = this.buildPrompt(user, context);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const recommendations = this.parseAIResponse(text);
      const songs = await this.matchSongsFromDatabase(recommendations);

      return {
        songs,
        reason: 'Based on your listening preferences and mood',
        basedOn: 'AI analysis (Gemini)'
      };
    } catch (error) {
      console.error('AI Recommendation Error:', error.message);
      return this.getFallbackRecommendations(user, context);
    }
  }

  buildPrompt(user, context) {
    const { mood, preferences } = context;
    return `Recommend 10 songs for a user who likes ${preferences?.favoriteGenres?.join(', ') || 'various genres'} 
    and is currently feeling ${mood || 'neutral'}. 
    Focus on popular and well-known tracks. Return only song titles and artists in this exact format: "Song Title - Artist Name". Do not include numbering or extra text.`;
  }

  parseAIResponse(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Clean up numbering like "1. " or "- "
      const cleanLine = line.replace(/^[\d-]+\.\s*/, '').replace(/^\*\s*/, '');
      const [title, artist] = cleanLine.split(' - ');
      return { title: title?.trim(), artist: artist?.trim() };
    }).filter(song => song.title && song.artist);
  }

  async matchSongsFromDatabase(recommendations) {
    const songs = [];
    for (const rec of recommendations) {
      const song = await Song.findOne({
        $or: [
          { title: new RegExp(rec.title, 'i') },
          { artist: new RegExp(rec.artist, 'i') }
        ]
      });
      if (song) songs.push(song);
    }
    return songs;
  }

  async getFallbackRecommendations(user, context) {
    const { mood, preferences } = context;

    // Build query based on user preferences
    const query = {};

    if (mood) {
      query.mood = mood;
    } else if (preferences?.favoriteGenres?.length > 0) {
      query.genre = { $in: preferences.favoriteGenres };
    }

    let songs = await Song.find(query)
      .sort({ plays: -1 })
      .limit(10);

    // If no songs found with preferences, get random popular songs
    if (songs.length === 0) {
      songs = await Song.find().sort({ plays: -1 }).limit(10);
    }

    return {
      songs,
      reason: mood
        ? `Popular ${mood} songs`
        : 'Popular recommendations based on your preferences',
      basedOn: 'database matching'
    };
  }
}

module.exports = new AIRecommendationService();

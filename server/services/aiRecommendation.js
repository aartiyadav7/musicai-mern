const Anthropic = require('@anthropic-ai/sdk');
const Song = require('../models/Song');

class AIRecommendationService {
  constructor() {
    // Only initialize if API key exists
    if (process.env.CLAUDE_API_KEY) {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.CLAUDE_API_KEY,
        });
        this.hasAPIKey = true;
        console.log('✅ Claude AI initialized');
      } catch (error) {
        console.warn('⚠️  Failed to initialize Anthropic client:', error.message);
        this.hasAPIKey = false;
      }
    } else {
      console.warn('⚠️  CLAUDE_API_KEY not found - using fallback recommendations');
      this.hasAPIKey = false;
    }
  }

  async generateRecommendations(user, context = {}) {
    // If no API key, use fallback immediately
    if (!this.hasAPIKey || !this.anthropic) {
      console.log('📊 Using fallback recommendations');
      return this.getFallbackRecommendations(user, context);
    }

    try {
      const prompt = this.buildPrompt(user, context);
      
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const recommendations = this.parseAIResponse(message.content[0].text);
      const songs = await this.matchSongsFromDatabase(recommendations);

      return {
        songs,
        reason: 'Based on your listening preferences and mood',
        basedOn: 'AI analysis'
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
    Focus on popular and well-known tracks. Return only song titles and artists in format: "Song Title - Artist Name"`;
  }

  parseAIResponse(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const [title, artist] = line.replace(/^\d+\.\s*/, '').split(' - ');
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

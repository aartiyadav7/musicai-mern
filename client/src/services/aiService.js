import api from './api';

export const getAIRecommendations = async (mood = null) => {
  try {
    const params = mood ? { mood } : {};
    const response = await api.get('/recommendations', { params });
    return response.data;
  } catch (error) {
    console.error('AI Recommendation error:', error);
    throw error;
  }
};

export const getRecommendationsByMood = async (mood) => {
  try {
    const response = await api.get(`/recommendations/mood/${mood}`);
    return response.data;
  } catch (error) {
    console.error('Mood recommendation error:', error);
    throw error;
  }
};

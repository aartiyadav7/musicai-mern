module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpire: '7d',
  claudeApiKey: process.env.CLAUDE_API_KEY,
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI, 
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

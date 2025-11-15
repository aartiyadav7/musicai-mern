const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

async function testClaude() {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        { role: 'user', content: 'Say hello!' }
      ],
    });
    
    console.log('✅ Claude API works!');
    console.log('Response:', message.content[0].text);
  } catch (error) {
    console.error('❌ Claude API error:', error.message);
  }
}

testClaude();

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        const result = await model.generateContent("Say hello to MusicAI!");
        const response = await result.response;
        consttext = response.text();

        console.log('✅ Gemini API works!');
        console.log('Response:', text);
    } catch (error) {
        console.error('❌ Gemini API error:', error.message);
    }
}

testGemini();

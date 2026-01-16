const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("❌ No GEMINI_API_KEY found in environment!");
    process.exit(1);
}
console.log(`Key found: ${key.substring(0, 4)}...${key.substring(key.length - 4)} (Length: ${key.length})`);
const genAI = new GoogleGenerativeAI(key);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Note: getGenerativeModel doesn't list models, but we can try to use a dummy call or check docs.
        // Actually, the SDK doesn't expose listModels directly easily in the simpler usage, 
        // but the error message suggested calling ListModels.
        // Let's try to use the raw API fetch to list models.

        // BUT, for now, let's try 'gemini-1.0-pro' explicitly
        // or just 'gemini-pro' usually works.

        // Let's try to infer from common issues. 404 often means the key is not active or wrong endpoint.
        // However, I will try catch the error more gracefully.

        console.log("Checking commonly available free models...");
        const models = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-flash-latest"];

        for (const m of models) {
            try {
                console.log(`Testing ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Test");
                console.log(`✅ SUCCESS with ${m}`);
                return;
            } catch (e) {
                console.log(`❌ Failed ${m}:`, e.message.split(':')[0]);
            }
        }

    } catch (error) {
        console.error('List Models error:', error.message);
    }
}

listModels();

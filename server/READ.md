# MusicAI - MERN Stack Music Streaming Platform

AI-powered music streaming application with personalized recommendations.

## Features

- User authentication (login/register)
- AI-powered music recommendations
- Music player with queue management
- Admin dashboard for CRUD operations
- Playlist management
- Favorites functionality
- Search and filter by genre/mood

## Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** Anthropic Claude API (fallback to database recommendations)

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB

### Installation

1. Clone the repository:
   git clone https://github.com/aartiyadav7/musicai-mern.git
   cd musicai-mern

2. Install backend dependencies:
   cd server
   npm install

3. Install frontend dependencies:
   cd../client
   npm install

4. Set up environment variables:
   create `server/.env`:

MONGODB_URI=mongodb://localhost:27017/musicai
JWT_SECRET=JWT_SECRET=f75059154b1e5a510ff01c4d174190e9b043313c0101d5648c31637e8a42b4ea232655193c5d868bb7012f6f497a1ef7a765c754c2be9a45814fb853ce415497
PORT=5000
CLIENT_URL=http://localhost:3000
Create `client/.env`:

VITE_API_URL=http://localhost:5000/api

5. Seed the database:
   cd server
   node seed.js

6. run the application:
   Backend:
   cd server
   npm run dev

Frontend:  
cd client
npm run dev

7. Access the app at `http://localhost:3000`

## Admin Credentials

- Email: admin@musicai.com
- Password: admin123

## Author

[Aarti Yadav] - MTech AI/ML Student

## License

MIT

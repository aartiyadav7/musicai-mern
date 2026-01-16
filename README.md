# 🎵 MusicAI - MERN Stack App

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://musicai-mern.vercel.app)
🚀 **Live Demo:** [https://musicai-mern.vercel.app](https://musicai-mern.vercel.app)

MusicAI is a modern music streaming application with personalized recommendations.

## Features

- **User Authentication**: Secure login and registration.
- **AI-Powered Recommendations**: Personalized music suggestions using AI (Anthropic Claude).
- **Music Player**: Full-featured player with queue management.
- **Admin Dashboard**: Manage songs, users, and system analytics.
- **Playlist Management**: Create and organize custom playlists.
- **Search & Filter**: Find music by genre, mood, or artist.

## Tech Stack

- **Frontend:** React.js, TailwindCSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** Google Gemini API

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aartiyadav7/musicai-mern.git
    cd musicai-mern
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    Create `server/.env`:
    ```env
    MONGODB_URI=mongodb://localhost:27017/musicai
    JWT_SECRET=your_secret_key_here
    PORT=5000
    CLIENT_URL=http://localhost:3000
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

    Create `client/.env`:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Seed Database (Optional)**
    ```bash
    cd server
    node seed.js
    ```

5.  **Run Application**
    ```bash
    # Run Server (Terminal 1)
    cd server
    npm run dev

    # Run Client (Terminal 2)
    cd client
    npm run dev
    ```

## Admin Credentials
- **Email:** `admin@musicai.com`
- **Password:** `admin123`

## License
MIT

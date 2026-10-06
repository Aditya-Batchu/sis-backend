# RGUKT SIS - Backend API

RESTful API service for the **RGUKT Student Information System (SIS)**.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (v4)
- **Database**: MongoDB with Mongoose ODM (v8)
- **Middleware & Utilities**: CORS, Morgan, Dotenv, Nodemon

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local MongoDB or MongoDB Atlas Free Tier)

### Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB connection details:
   ```bash
   cp .env.example .env
   ```

   Default configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/rgukt_sis
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. Seed constituent campus master data:
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   # Development mode with live reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be accessible at `http://localhost:5000`.

## 📌 API Endpoints Overview

- `GET /health` — Health check status
- `GET /api/campuses` — Retrieve all constituent campuses (supports search, sort, filters)
- `GET /api/campuses/:id` — Retrieve campus details by ID / Code
- `POST /api/campuses` — Create new campus entry
- `PUT /api/campuses/:id` — Update existing campus details
- `DELETE /api/campuses/:id` — Soft-delete campus entry

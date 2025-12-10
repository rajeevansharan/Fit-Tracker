# 🏋️ FitTracker Pro

A professional, full-stack fitness tracking application built with **Next.js**, **Node.js**, **Express**, **MongoDB**, and **TypeScript**.

![FitTracker](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-green)
![Node](https://img.shields.io/badge/Node.js-v16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v5+-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)

Transform your fitness journey with comprehensive workout tracking, progress monitoring, and personalized training plans.

## ✨ Features

### 🎯 Core Features

- **User Authentication** - Secure JWT-based registration and login
- **Workout Builder** - Create and customize workout routines
- **Exercise Library** - Comprehensive database of exercises
- **Live Workout Tracking** - Track sets, reps, and weight in real-time
- **Progress Dashboard** - Visualize your fitness journey with charts
- **Personal Records** - Automatic PR detection and celebration
- **Workout Timer** - Built-in rest timer with notifications
- **Dark/Light Mode** - Beautiful UI with theme toggle

### 💪 Advanced Features

- **Streak Tracking** - Monitor workout consistency
- **Body Measurements** - Track weight, body fat, and measurements
- **Custom Exercises** - Create your own exercises
- **Workout Templates** - Save and reuse favorite workouts
- **Volume Calculations** - Automatic workout volume tracking
- **Session History** - Complete workout history with statistics
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed  # Seed database with default exercises
   npm run dev   # Start backend server (port 5000)
   ```

2. **Frontend Setup** (in a new terminal)

   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local if needed (default: http://localhost:5000/api)
   npm run dev   # Start frontend server (port 3000)
   ```

3. **Access the Application**
   - Open http://localhost:3000
   - Register a new account
   - Start tracking your fitness!

📖 **Detailed setup instructions:** See [SETUP.md](SETUP.md)

## 🏗️ Tech Stack

### Frontend

- **Framework:** Next.js 15.5.4 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workouts

- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout

### Exercises

- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create custom exercise

Full API documentation: [API-REFERENCE.md](API-REFERENCE.md)

## 📁 Project Structure

```
Fit-Tracker/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & validation
│   │   ├── config/      # Database config
│   │   └── utils/       # Helper functions
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/            # Next.js application
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/            # API client & utilities
│   ├── public/         # Static assets
│   └── package.json
│
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

---

**Happy Training! 💪🏋️‍♂️**

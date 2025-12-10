# FitTracker Pro - Complete Setup Guide

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:

- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- helmet
- morgan
- express-validator
- express-rate-limit
- compression

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Update if using a different connection string
MONGODB_URI=mongodb://localhost:27017/fit-tracker

# JWT Secret - IMPORTANT: Change this to a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string
JWT_EXPIRE=7d

# Frontend URL
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANT:** For production, generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start MongoDB

**On Windows:**

```bash
# If MongoDB is installed as a service, it should already be running
# Otherwise, start it manually:
mongod
```

**On macOS (with Homebrew):**

```bash
brew services start mongodb-community
```

**On Linux:**

```bash
sudo systemctl start mongod
```

### 5. Seed the Database (Optional but Recommended)

This will populate the database with default exercises:

```bash
npm run seed
```

You should see:

```
🌱 Seeding database...
✅ Cleared existing default exercises
✅ Added 10 default exercises
🎉 Database seeded successfully!
```

### 6. Start the Backend Server

**Development Mode (with auto-reload):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

You should see:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🏋️  FitTracker API Server Running 🏋️              ║
║                                                           ║
║  Environment: DEVELOPMENT                                 ║
║  Port: 5000                                               ║
║  Database: Connected                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

MongoDB Connected: localhost
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Copy the example file (if exists) or create manually
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start the Frontend Development Server

```bash
npm run dev
```

You should see:

```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

## Running the Application

### Start Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Access the Application

1. Open your browser and navigate to: **http://localhost:3000**
2. You should see the FitTracker login page
3. Create a new account by clicking "Sign up"

### First Time Setup

1. **Register a new account:**

   - Click "Sign up"
   - Enter your name, email, and password
   - Click "Create Account"

2. **You'll be automatically logged in and redirected to the dashboard**

3. **Explore the features:**
   - **Dashboard:** View your progress and statistics
   - **Workouts:** Create and manage workout routines
   - **Exercises:** Browse the exercise library
   - **Timer:** Use the workout timer

## Database Seeding

The seed script adds these default exercises:

- Bench Press
- Squats
- Pull-ups
- Push-ups
- Deadlift
- Plank
- Shoulder Press
- Barbell Row
- Lunges
- Bicep Curls

To re-seed the database:

```bash
cd backend
npm run seed
```

## Testing the API

### Health Check

Test if the backend is running:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "FitTracker API is running",
  "timestamp": "2024-12-11T..."
}
```

### Register a Test User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response for authenticated requests.

### Get Exercises (Authenticated)

```bash
curl http://localhost:5000/api/exercises \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend (change port):**
Edit `backend/.env`:

```env
PORT=5001
```

**Frontend (change port):**

```bash
# Run on different port
npm run dev -- -p 3001
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**

1. Make sure MongoDB is running:
   ```bash
   mongod
   ```
2. Check if MongoDB service is active:

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services list

   # Linux
   sudo systemctl status mongod
   ```

### CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
Make sure `CORS_ORIGIN` in `backend/.env` matches your frontend URL:

```env
CORS_ORIGIN=http://localhost:3000
```

### JWT Token Error

**Error:** `Not authorized to access this route`

**Solution:**

1. Make sure you're logged in
2. Check that the token is being sent in the Authorization header
3. Verify `JWT_SECRET` is set in `backend/.env`

### Module Not Found

**Error:** `Cannot find module`

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Auto-reload Not Working

Make sure you're using `npm run dev` (not `npm start`) for both frontend and backend.

### View MongoDB Data

Use MongoDB Compass (GUI) or mongosh (CLI):

```bash
mongosh
use fit-tracker
db.users.find()
db.exercises.find()
```

### Clear Database

```bash
mongosh
use fit-tracker
db.dropDatabase()
```

Then re-seed:

```bash
cd backend
npm run seed
```

## Next Steps

1. ✅ Create your first workout
2. ✅ Add exercises from the library
3. ✅ Start a workout session
4. ✅ Track your progress

## Support

For issues:

1. Check this troubleshooting guide
2. Review console errors in browser DevTools (F12)
3. Check server logs in terminal
4. Review API responses

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or another cloud MongoDB service
4. Set up proper CORS origins
5. Enable HTTPS
6. Use environment variables for all sensitive data
7. Set up proper logging and monitoring

---

Happy coding! 🏋️‍♂️💪

# FitTracker Pro - Backend API

A professional, scalable RESTful API for fitness tracking built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Workout Management** - Create, update, and organize workout routines
- **Exercise Library** - Comprehensive exercise database with custom exercise support
- **Workout Sessions** - Track live workout sessions with set-by-set logging
- **Progress Tracking** - Monitor body metrics, PRs, and workout statistics
- **Real-time Stats** - Dashboard with weekly progress, volume, and performance metrics
- **Security** - Rate limiting, helmet security headers, CORS protection
- **Scalability** - Mongoose indexes, pagination, and optimized queries

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fit-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

5. **Seed the database** (optional, adds default exercises)

   ```bash
   npm run seed
   ```

6. **Start the server**

   Development mode with auto-reload:

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Workouts

#### Get All Workouts

```http
GET /api/workouts?page=1&limit=10&category=Strength
Authorization: Bearer <token>
```

#### Create Workout

```http
POST /api/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Push Day",
  "description": "Chest, shoulders, and triceps",
  "category": "Strength",
  "exercises": [
    {
      "exerciseId": "64abc...",
      "name": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185,
      "order": 1
    }
  ]
}
```

#### Get Single Workout

```http
GET /api/workouts/:id
Authorization: Bearer <token>
```

#### Update Workout

```http
PUT /api/workouts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Push Day",
  "exercises": [...]
}
```

#### Delete Workout

```http
DELETE /api/workouts/:id
Authorization: Bearer <token>
```

### Exercises

#### Get All Exercises

```http
GET /api/exercises?category=Strength&muscle=Chest&difficulty=Intermediate
Authorization: Bearer <token>
```

#### Create Custom Exercise

```http
POST /api/exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Custom Exercise",
  "category": "Strength",
  "muscle": "Chest",
  "equipment": "Dumbbell",
  "difficulty": "Intermediate",
  "instructions": [
    "Step 1",
    "Step 2"
  ]
}
```

### Workout Sessions

#### Start Workout Session

```http
POST /api/sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutId": "64abc...",
  "workoutName": "Push Day"
}
```

#### Complete Workout Session

```http
POST /api/sessions/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "notes": "Great workout!"
}
```

#### Get Workout Statistics

```http
GET /api/sessions/stats/summary?period=month
Authorization: Bearer <token>
```

### Progress

#### Get Progress Dashboard

```http
GET /api/progress/dashboard?period=6weeks
Authorization: Bearer <token>
```

#### Create Progress Entry

```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-12-11",
  "bodyWeight": 180,
  "bodyFat": 15.5,
  "measurements": {
    "chest": 42,
    "waist": 32
  }
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── workoutController.js # Workout CRUD operations
│   │   ├── exerciseController.js
│   │   ├── sessionController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── error.js             # Error handling
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Workout.js           # Workout schema
│   │   ├── Exercise.js          # Exercise schema
│   │   ├── WorkoutSession.js    # Session tracking
│   │   └── Progress.js          # Progress tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── exerciseRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── progressRoutes.js
│   ├── utils/
│   │   └── helpers.js           # Utility functions
│   ├── server.js                # App entry point
│   └── seed.js                  # Database seeding
├── .env.example
├── .gitignore
└── package.json
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent API abuse
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - express-validator
- **MongoDB Injection Protection** - Mongoose sanitization

## 🚦 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

## 📊 Database Models

### User

- Authentication credentials
- Personal information
- Preferences (theme, units)
- Statistics (streak, total workouts, PRs)

### Workout

- Name, description, category
- List of exercises with sets/reps/weight
- Completion tracking

### Exercise

- Exercise details (name, muscle, equipment)
- Instructions and tips
- Custom vs. default exercises

### WorkoutSession

- Live workout tracking
- Set-by-set logging
- Duration and volume calculations
- Personal records tracking

### Progress

- Body measurements
- Weight history
- Exercise records
- Progress photos

## 🧪 Testing

Health check endpoint:

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

## 📝 Environment Variables

| Variable      | Description               | Default                                 |
| ------------- | ------------------------- | --------------------------------------- |
| `NODE_ENV`    | Environment mode          | `development`                           |
| `PORT`        | Server port               | `5000`                                  |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/fit-tracker` |
| `JWT_SECRET`  | JWT signing secret        | Required                                |
| `JWT_EXPIRE`  | Token expiration          | `7d`                                    |
| `CORS_ORIGIN` | Allowed origin            | `http://localhost:3000`                 |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Built with ❤️ for fitness enthusiasts

## 🆘 Support

For issues and questions, please open a GitHub issue.

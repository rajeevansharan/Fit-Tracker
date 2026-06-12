# FitTracker API Quick Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Get Profile

```http
GET /auth/me
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "stats": { ... }
    }
  }
}
```

## Workouts

### List Workouts

```http
GET /workouts?page=1&limit=10&category=Strength
Authorization: Bearer <token>

Response: {
  "success": true,
  "pagination": { ... },
  "data": [ ... ]
}
```

### Create Workout

```http
POST /workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Push Day",
  "description": "Chest and triceps workout",
  "category": "Strength",
  "difficulty": "Intermediate",
  "exercises": [
    {
      "exerciseId": "64abc123...",
      "name": "Bench Press",
      "sets": 4,
      "reps": 8,
      "weight": 185,
      "order": 1
    }
  ]
}
```

### Get Single Workout

```http
GET /workouts/:id
Authorization: Bearer <token>
```

### Update Workout

```http
PUT /workouts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Push Day",
  "exercises": [ ... ]
}
```

### Delete Workout

```http
DELETE /workouts/:id
Authorization: Bearer <token>
```

### Duplicate Workout

```http
POST /workouts/:id/duplicate
Authorization: Bearer <token>
```

## Exercises

### List Exercises

```http
GET /exercises?category=Strength&muscle=Chest&difficulty=Intermediate&page=1&limit=20
Authorization: Bearer <token>

Response: {
  "success": true,
  "pagination": { ... },
  "data": [
    {
      "id": "...",
      "name": "Bench Press",
      "category": "Strength",
      "muscle": "Chest",
      "equipment": "Barbell",
      "difficulty": "Intermediate",
      "instructions": [ ... ]
    }
  ]
}
```

### Get Single Exercise

```http
GET /exercises/:id
Authorization: Bearer <token>
```

### Create Custom Exercise

```http
POST /exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Custom Exercise",
  "category": "Strength",
  "muscle": "Chest",
  "equipment": "Dumbbell",
  "difficulty": "Intermediate",
  "instructions": [
    "Step 1...",
    "Step 2..."
  ],
  "tips": ["Tip 1...", "Tip 2..."]
}
```

### Get Exercise Metadata

```http
GET /exercises/meta/categories
GET /exercises/meta/muscles
GET /exercises/meta/equipment
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "categories": ["Strength", "Cardio", ...]
  }
}
```

## Workout Sessions

### List Sessions

```http
GET /sessions?page=1&limit=10&status=completed
Authorization: Bearer <token>
```

### Start Workout Session

```http
POST /sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutId": "64abc...",  // Optional
  "workoutName": "Push Day",
  "exercises": [
    {
      "exerciseId": "64abc...",
      "name": "Bench Press",
      "sets": [
        { "setNumber": 1, "reps": 8, "weight": 185, "completed": false }
      ],
      "order": 1
    }
  ]
}

Response: {
  "success": true,
  "data": {
    "session": {
      "id": "...",
      "status": "in-progress",
      "startTime": "2024-12-11T...",
      ...
    }
  }
}
```

### Update Session

```http
PUT /sessions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "exercises": [
    {
      "exerciseId": "...",
      "name": "Bench Press",
      "sets": [
        { "setNumber": 1, "reps": 8, "weight": 185, "completed": true },
        { "setNumber": 2, "reps": 8, "weight": 185, "completed": true }
      ]
    }
  ]
}
```

### Complete Session

```http
POST /sessions/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "notes": "Great workout!"
}

Response: {
  "success": true,
  "data": {
    "session": {
      "status": "completed",
      "endTime": "...",
      "duration": 3600,
      "totalVolume": 15000
    }
  }
}
```

### Cancel Session

```http
POST /sessions/:id/cancel
Authorization: Bearer <token>
```

### Get Workout Statistics

```http
GET /sessions/stats/summary?period=month
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "stats": {
      "totalWorkouts": 23,
      "totalVolume": 125000,
      "totalDuration": 82800,
      "averageDuration": 3600
    }
  }
}
```

## Progress Tracking

### Get Progress Dashboard

```http
GET /progress/dashboard?period=6weeks
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "dashboard": {
      "weeklyData": [
        { "week": "Week 1", "workouts": 4, "totalVolume": 12000 }
      ],
      "exerciseStats": [ ... ],
      "summary": { ... }
    }
  }
}
```

### List Progress Entries

```http
GET /progress?page=1&limit=10&startDate=2024-01-01
Authorization: Bearer <token>
```

### Create Progress Entry

```http
POST /progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-12-11",
  "bodyWeight": 180,
  "bodyFat": 15.5,
  "muscleMass": 145,
  "measurements": {
    "chest": 42,
    "waist": 32,
    "biceps": 15
  },
  "notes": "Feeling strong!"
}
```

### Get Weight History

```http
GET /progress/weight-history?period=month
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "weightHistory": [
      {
        "date": "2024-12-01",
        "bodyWeight": 178,
        "bodyFat": 16
      }
    ]
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "success": true,
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "next": 2
  },
  "count": 10,
  "data": [ ... ]
}
```

## Common Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (use `-` prefix for descending)
- `category` - Filter by category
- `search` - Text search
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `period` - Time period (week, month, year, 6weeks)

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Invalid Token
- `403` - Forbidden / No Permission
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

## Notes

- All dates are in ISO 8601 format
- All timestamps are in UTC
- Weight is in pounds (lbs) by default
- Distance is in miles by default
- Duration is in seconds
- Volume is calculated as: sets × reps × weight

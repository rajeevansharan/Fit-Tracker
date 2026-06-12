# 📁 Project Structure - FitTracker Pro

## Overview

FitTracker is now organized as a **monorepo** with separate frontend and backend folders, making it easier to develop, deploy, and maintain each part independently.

```
Fit-Tracker/
│
├── backend/              # Node.js + Express API Server
│   ├── src/
│   │   ├── models/      # Mongoose schemas (User, Workout, Exercise, etc.)
│   │   ├── controllers/ # Business logic & request handlers
│   │   ├── routes/      # API route definitions
│   │   ├── middleware/  # Authentication, validation, error handling
│   │   ├── config/      # Database configuration
│   │   └── utils/       # Helper functions
│   ├── server.js        # Express server entry point
│   ├── seed.js          # Database seeding script
│   ├── package.json     # Backend dependencies
│   ├── .env             # Backend environment variables
│   └── README.md        # Backend documentation
│
├── frontend/            # Next.js + React Application
│   ├── app/            # Next.js App Router pages
│   │   ├── layout.tsx  # Root layout
│   │   ├── page.tsx    # Dashboard page
│   │   ├── login/      # Login page
│   │   └── register/   # Registration page
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── workout-builder.tsx
│   │   ├── exercise-library.tsx
│   │   ├── progress-dashboard.tsx
│   │   └── workout-timer.tsx
│   ├── lib/           # Utilities & API client
│   │   ├── api.ts     # Backend API service layer
│   │   ├── auth-context.tsx
│   │   └── utils.ts
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   ├── .env.local     # Frontend environment variables
│   └── README.md      # Frontend documentation
│
├── README.md          # Main project documentation
├── SETUP.md           # Complete setup guide
├── QUICKSTART.md      # 5-minute quick start
├── API-REFERENCE.md   # API documentation
├── PROJECT-SUMMARY.md # What was built
├── CHECKLIST.md       # Deployment checklist
│
└── Setup Scripts
    ├── setup-all.bat        # Complete Windows setup
    ├── setup-all.sh         # Complete Unix/macOS setup
    ├── setup-backend.bat    # Backend Windows setup
    ├── setup-backend.sh     # Backend Unix/macOS setup
    ├── setup-frontend.bat   # Frontend Windows setup
    └── setup-frontend.sh    # Frontend Unix/macOS setup
```

## Quick Navigation

### Backend Development

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server (port 5000)
npm run seed         # Seed database with exercises
npm start            # Start production server
```

### Frontend Development

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
```

## Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.0
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Utilities**: compression, morgan (logging)

### Frontend

- **Framework**: Next.js 15.5.4
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **Icons**: Lucide React

## Environment Configuration

### Backend (.env)

Located at: `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fit-tracker
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

Located at: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Development Workflow

### Starting Development

1. **Start MongoDB**:

   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Server runs on: http://localhost:5000

3. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on: http://localhost:3000

### Making Changes

**Backend Changes**:

- Modify files in `backend/src/`
- Server auto-restarts with nodemon
- Test API at http://localhost:5000/api

**Frontend Changes**:

- Modify files in `frontend/app/` or `frontend/components/`
- Hot reload updates browser automatically
- View changes at http://localhost:3000

## API Endpoints

All API endpoints are prefixed with `/api`:

- **Auth**: `/api/auth/*`
- **Workouts**: `/api/workouts/*`
- **Exercises**: `/api/exercises/*`
- **Sessions**: `/api/sessions/*`
- **Progress**: `/api/progress/*`

See [API-REFERENCE.md](API-REFERENCE.md) for complete documentation.

## Database

**Connection**: MongoDB running on `localhost:27017`
**Database Name**: `fit-tracker`

**Collections**:

- `users` - User accounts
- `workouts` - Workout templates
- `exercises` - Exercise library
- `workoutsessions` - Completed workouts
- `progresses` - Body measurements & PRs

## Deployment

### Backend Deployment

- Can be deployed to: Heroku, AWS, DigitalOcean, Railway, Render
- Requires MongoDB Atlas or managed MongoDB instance
- Set environment variables in hosting platform
- Use `npm start` command

### Frontend Deployment

- Can be deployed to: Vercel, Netlify, AWS Amplify
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Use `npm run build` to create optimized build

## Benefits of This Structure

✅ **Separation of Concerns**: Frontend and backend are completely independent
✅ **Independent Deployment**: Deploy frontend and backend separately
✅ **Clear Organization**: Easy to find and modify code
✅ **Scalability**: Can add more apps (mobile, admin panel) easily
✅ **Team Collaboration**: Frontend and backend teams can work independently
✅ **Technology Flexibility**: Can swap frontend/backend independently
✅ **Better Version Control**: Clear history of changes to each part

## Common Tasks

### Add a New API Endpoint

1. Create controller function in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Add API method in `frontend/lib/api.ts`
4. Use in components

### Add a New Page

1. Create page in `frontend/app/new-page/page.tsx`
2. Access at http://localhost:3000/new-page

### Add a New Component

1. Create in `frontend/components/my-component.tsx`
2. Import and use in pages

## Getting Help

- **Setup Issues**: See [SETUP.md](SETUP.md)
- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md)
- **API Reference**: See [API-REFERENCE.md](API-REFERENCE.md)
- **Feature List**: See [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)
- **Deployment**: See [CHECKLIST.md](CHECKLIST.md)

## Next Steps

1. ✅ Project structure is organized
2. ✅ Backend is ready to run
3. ✅ Frontend is ready to run
4. ⏭️ Install dependencies: `./setup-all.bat` (Windows) or `./setup-all.sh` (Unix)
5. ⏭️ Start developing!

---

**Happy Coding! 🚀**

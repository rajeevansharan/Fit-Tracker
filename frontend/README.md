# Fit-Tracker Frontend

Modern fitness tracking application built with Next.js 15, React 19, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom wrapper

## Features

- 🏋️ **Workout Builder**: Create and customize workout plans
- 📚 **Exercise Library**: Browse and search exercises
- 📊 **Progress Dashboard**: Track your fitness journey with charts
- ⏱️ **Workout Timer**: Time your exercises and rest periods
- 🔐 **Authentication**: Secure login and registration
- 🎨 **Theme Toggle**: Light/dark mode support
- 📱 **Responsive Design**: Works on all devices

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home/Dashboard page
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── exercise-library.tsx
│   ├── progress-dashboard.tsx
│   ├── theme-toggle.tsx
│   ├── workout-builder.tsx
│   └── workout-timer.tsx
├── lib/                   # Utilities and helpers
│   ├── api.ts            # API client for backend
│   ├── auth-context.tsx  # Authentication context
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see ../backend/README.md)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:

   ```bash
   # Create .env.local file
   echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Integration

The frontend connects to the backend API through the `lib/api.ts` service layer. All API endpoints are typed and include:

- Authentication (login, register, logout)
- Workouts (CRUD operations)
- Exercises (library management)
- Workout Sessions (tracking)
- Progress (statistics and analytics)

## Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. AuthContext provides auth state globally
4. Protected routes check authentication
5. API requests include token in headers

## Development Notes

- Uses Next.js App Router (not Pages Router)
- All components are server components by default
- Client components marked with `'use client'`
- Tailwind CSS for styling with custom theme
- shadcn/ui for pre-built accessible components

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

Can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to your production API URL.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

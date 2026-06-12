# 🚀 QUICK START GUIDE

## ⚡ Get Running in 5 Minutes

### Step 1: Start MongoDB

```bash
# MongoDB should be running. If not, start it:
mongod
```

### Step 2: Seed the Database

```bash
cd backend
npm run seed
```

Expected output:

```
🌱 Seeding database...
✅ Cleared existing default exercises
✅ Added 10 default exercises
🎉 Database seeded successfully!
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

You should see:

```
╔═══════════════════════════════════════════════════════════╗
║         🏋️  FitTracker API Server Running 🏋️              ║
║  Environment: DEVELOPMENT                                 ║
║  Port: 5000                                               ║
╚═══════════════════════════════════════════════════════════╝
MongoDB Connected: localhost
```

### Step 4: Start Frontend (Terminal 2)

```bash
cd frontend
npm install  # If not already done
npm run dev
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

### Step 6: Register & Login

1. Click "Sign up"
2. Create your account
3. Start tracking your workouts! 🎉

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 📁 Important Files

- `backend/.env` - Backend configuration (already set up)
- `frontend/.env.local` - Frontend configuration (already set up)
- `backend/src/server.js` - Backend entry point
- `frontend/app/page.tsx` - Main app page

---

## 🆘 Troubleshooting

### Port already in use?

Kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB not running?

```bash
# Windows (if installed as service)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Can't connect to backend?

Make sure:

1. MongoDB is running
2. Backend server is running on port 5000
3. `.env` file exists in `backend/` directory

---

## 📚 Full Documentation

- [SETUP.md](SETUP.md) - Complete setup guide
- [backend/README.md](backend/README.md) - Backend API docs
- [API-REFERENCE.md](API-REFERENCE.md) - API endpoints reference

---

**You're all set! Happy tracking! 💪🏋️**

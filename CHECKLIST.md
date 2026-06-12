# ✅ FitTracker Pro - Deployment Checklist

## Pre-Deployment Checklist

### Backend Setup

- [x] Backend dependencies installed (`npm install` in backend/)
- [x] `.env` file created and configured
- [x] MongoDB connection string configured
- [x] JWT_SECRET set (change in production!)
- [x] All models created and tested
- [x] All controllers implemented
- [x] All routes configured
- [x] Middleware set up (auth, error, validation)
- [x] Database seeding script ready

### Frontend Setup

- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [x] `.env.local` file created in frontend/
- [x] API URL configured
- [x] Auth context implemented
- [x] Login/Register pages created
- [x] Protected routes configured
- [x] API service layer created

### Database

- [ ] MongoDB installed and running
- [ ] Database seeded with exercises (`npm run seed`)
- [ ] Database connection tested

### Testing

- [ ] Backend health check works (`http://localhost:5000/health`)
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] Protected endpoints require auth
- [ ] Frontend connects to backend

---

## Running the Application

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

✅ Server running on http://localhost:5000

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

✅ App running on http://localhost:3000

---

## First-Time Setup Steps

1. [ ] **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. [ ] **Start MongoDB**

   ```bash
   mongod
   ```

   Or use MongoDB service if installed

3. [ ] **Seed the Database**

   ```bash
   cd backend
   npm run seed
   ```

   Should see: ✅ Added 10 default exercises

4. [ ] **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Should see: 🏋️ FitTracker API Server Running

5. [ ] **Start Frontend Server** (new terminal)

   ```bash
   cd frontend
   npm run dev
   ```

   Should see: ▲ Next.js ready

6. [ ] **Open Browser**
       Navigate to http://localhost:3000

7. [ ] **Register Account**
       Click "Sign up" and create your account

8. [ ] **Test Features**
   - [ ] Dashboard loads
   - [ ] Can create workout
   - [ ] Can browse exercises
   - [ ] Timer works
   - [ ] Logout/Login works

---

## Verification Steps

### Backend Verification

```bash
# Health check
curl http://localhost:5000/health

# Register test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get exercises (use token from login)
curl http://localhost:5000/api/exercises \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Verification

- [ ] http://localhost:3000 loads
- [ ] Login page displays
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard displays user name
- [ ] All tabs are clickable
- [ ] Logout works

---

## Common Issues & Solutions

### ❌ Port 5000 already in use

**Solution:**

```bash
# Change PORT in backend/.env to 5001
PORT=5001

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### ❌ MongoDB connection failed

**Solution:**

1. Check MongoDB is running: `mongod`
2. Check MONGODB_URI in backend/.env
3. Try: `mongodb://127.0.0.1:27017/fit-tracker`

### ❌ CORS error

**Solution:**

1. Check backend is running on port 5000
2. Check CORS_ORIGIN in backend/.env is `http://localhost:3000`
3. Restart backend server

### ❌ Cannot find module

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ JWT token not working

**Solution:**

1. Clear browser localStorage
2. Logout and login again
3. Check JWT_SECRET is set in backend/.env

---

## Production Deployment Checklist

### Backend

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (random 32+ chars)
- [ ] Use MongoDB Atlas or cloud database
- [ ] Set proper CORS_ORIGIN
- [ ] Enable HTTPS
- [ ] Set up logging service
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Document production URLs

### Frontend

- [ ] Build optimized bundle: `npm run build`
- [ ] Set NEXT_PUBLIC_API_URL to production backend
- [ ] Deploy to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Test production build
- [ ] Set up analytics (optional)
- [ ] Configure custom domain (optional)

### Database

- [ ] Use MongoDB Atlas for production
- [ ] Set up automated backups
- [ ] Configure connection limits
- [ ] Enable authentication
- [ ] Whitelist IP addresses
- [ ] Monitor database metrics

### Security

- [ ] Use HTTPS everywhere
- [ ] Secure environment variables
- [ ] Enable rate limiting
- [ ] Set secure CORS origins
- [ ] Use strong JWT secret
- [ ] Enable database authentication
- [ ] Set up SSL/TLS
- [ ] Review security headers

---

## Support & Documentation

- 📖 [QUICKSTART.md](QUICKSTART.md) - 5-minute setup
- 📖 [SETUP.md](SETUP.md) - Detailed setup guide
- 📖 [API-REFERENCE.md](API-REFERENCE.md) - API documentation
- 📖 [backend/README.md](backend/README.md) - Backend docs
- 📖 [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) - What was built

---

## Success Criteria

✅ Backend server running without errors
✅ Frontend app accessible at http://localhost:3000
✅ Can register new user
✅ Can login successfully
✅ JWT token stored and used
✅ Dashboard shows user data
✅ Can create workouts
✅ Can browse exercises
✅ Can use timer
✅ Dark mode toggle works
✅ Logout works

---

**🎉 Once all items are checked, you're ready to go!**

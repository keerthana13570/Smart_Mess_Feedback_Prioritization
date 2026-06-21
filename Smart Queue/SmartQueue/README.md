# SmartQueue — Mess Feedback Prioritization System

## What is SmartQueue?

SmartQueue is a full-stack mobile application that collects mess feedback from students and uses a scoring algorithm to prioritize issues for admins in real-time.

---

## Project Structure

```
SmartQueue/
├── backend/                  ← Node.js + Express + MongoDB + Socket.IO
│   ├── src/
│   │   ├── config/db.js      ← MongoDB connection (with in-memory fallback)
│   │   ├── controllers/      ← Auth, Feedback, SmartQueue controllers
│   │   ├── middleware/auth.js ← JWT auth + role guard
│   │   ├── models/           ← User, Feedback Mongoose models
│   │   ├── routes/           ← Express routers
│   │   ├── services/smartQueueService.js ← Scoring algorithm
│   │   ├── app.js            ← Express app factory
│   │   └── server.js         ← Entry point
│   ├── .env                  ← Environment variables
│   └── package.json
│
└── mobile/                   ← React Native (Expo) app
    ├── app/
    │   ├── index.tsx          ← Root redirect (auth check)
    │   ├── (auth)/
    │   │   ├── login.tsx      ← Login screen
    │   │   └── register.tsx   ← Register with role selection
    │   └── (app)/
    │       ├── admin.tsx      ← Admin SmartQueue dashboard
    │       └── (tabs)/
    │           ├── home.tsx       ← Submit feedback
    │           ├── my-feedback.tsx ← View own submissions
    │           └── settings.tsx   ← Account + logout
    ├── components/ui/         ← Button, Card, Input, Colors
    ├── lib/                   ← api, auth, socket, tokenStore, config
    ├── .env                   ← EXPO_PUBLIC_API_BASE_URL
    └── package.json
```

---

## Prerequisites

Install these before running:

1. **Node.js** v18+ → https://nodejs.org
2. **MongoDB Community** → https://www.mongodb.com/try/download/community
   - OR use the automatic in-memory fallback (no install needed)
3. **Expo Go app** on your phone → App Store / Google Play
4. **Git** (optional)

---

## STEP-BY-STEP RUN INSTRUCTIONS

### Step 1 — Start MongoDB (choose one option)

**Option A: MongoDB installed locally**
```
mongod
```
Or if installed as a service, it may already be running.

**Option B: No MongoDB installed**
The backend will automatically fall back to an in-memory MongoDB.
Data will reset when you restart the backend. This is fine for testing.

---

### Step 2 — Start the Backend

Open a **new PowerShell / Command Prompt** window:

```powershell
cd "c:\Users\Hawlet-Packard\OneDrive\Documents\New project\SmartQueue\backend"
npm start
```

You should see:
```
✅ MongoDB connected: mongodb://127.0.0.1:27017/smartqueue
✅ SmartQueue backend running on http://localhost:4000
   Health check: http://localhost:4000/health
```

**Test it works:** Open http://localhost:4000/health in your browser → should show `{"ok":true}`

---

### Step 3 — Find Your PC's IP Address (for physical device)

Open PowerShell and run:
```powershell
ipconfig
```
Look for **IPv4 Address** under your WiFi adapter, e.g. `192.168.1.5`

---

### Step 4 — Configure Mobile API URL

Edit `mobile/.env`:

```env
# For Android Emulator:
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000

# For iOS Simulator or Web:
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000

# For Physical Device (phone on same WiFi):
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.5:4000
```

Replace `192.168.1.5` with your actual PC IP from Step 3.

---

### Step 5 — Start the Mobile App

Open a **second PowerShell / Command Prompt** window:

```powershell
cd "c:\Users\Hawlet-Packard\OneDrive\Documents\New project\SmartQueue\mobile"
npx expo start
```

You will see a **QR code** in the terminal.

---

### Step 6 — Open on Your Device

**Physical Phone:**
1. Install **Expo Go** from App Store / Google Play
2. Open Expo Go → Scan the QR code
3. Make sure your phone is on the **same WiFi** as your PC

**Android Emulator:**
- Press `a` in the terminal (Android Studio must be installed)

**iOS Simulator (Mac only):**
- Press `i` in the terminal

**Web Browser:**
- Press `w` in the terminal

---

## Using the App

### Register as Student
1. Open app → tap "Create Account"
2. Fill in name, email, password
3. Select **Student** role → tap "Create Account"
4. You'll be taken to the feedback submission screen

### Register as Admin
1. Open app → tap "Create Account"
2. Fill in name, email, password
3. Select **Admin** role → tap "Create Account"
4. You'll be taken to the SmartQueue dashboard

### Submit Feedback (Student)
1. Select a **Topic** (Taste, Hygiene, Delay, Spicy, Others)
2. Select **Severity** (Minor / Moderate / Serious)
3. Write your message
4. Tap "Submit Feedback"

### View SmartQueue (Admin)
- Dashboard shows all topics sorted by priority score
- Score = (0.5 × total complaints) + (0.3 × recurrence_7d) + (0.2 × severity_weight)
- Updates in real-time via Socket.IO when students submit feedback
- Pull down to manually refresh

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Register (pass role: student/admin) |
| POST | /api/auth/login | None | Login |
| POST | /api/feedback/add | Student JWT | Submit feedback |
| GET | /api/feedback/user | Student JWT | Get own feedback |
| GET | /api/feedback/all | Admin JWT | Get all feedback |
| GET | /api/smartqueue | Admin JWT | Get prioritized queue |
| GET | /health | None | Health check |

---

## SmartQueue Scoring Algorithm

```
Score = (0.5 × number_of_reports) + (0.3 × recurrence_last_7_days) + (0.2 × severity_weight)

severity_weight:
  minor    = 1
  moderate = 2
  serious  = 3
```

Topics are grouped and sorted highest score first.

---

## Troubleshooting

### "Cannot reach server" on phone
- Make sure phone and PC are on the **same WiFi network**
- Update `mobile/.env` with your PC's IP address (from `ipconfig`)
- Make sure Windows Firewall allows port 4000

### Backend won't start
- Check `.env` file exists in `backend/` folder
- Run `npm install` in the backend folder
- If MongoDB fails, the in-memory fallback will activate automatically

### Expo app shows blank screen
- Press `r` in the Expo terminal to reload
- Clear Expo Go cache: shake phone → "Reload"
- Make sure `mobile/.env` has the correct API URL

### "Email already registered"
- Use a different email, or use the login screen

### Socket.IO not updating in real-time
- This is non-critical — use the pull-to-refresh on the admin dashboard
- Check that backend is running and accessible

### npm install fails
```powershell
npm install --legacy-peer-deps
```

### Expo cache issues
```powershell
npx expo start --clear
```

---

## Development Commands

```powershell
# Backend with auto-reload
cd backend
npm run dev

# Mobile with cache clear
cd mobile
npx expo start --clear
```

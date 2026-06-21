# SmartQueue - Complete Setup Guide

## ✅ STEP 1: Install Requirements

### Prerequisites:
- **Node.js** (v16+): https://nodejs.org/
- **npm** (comes with Node.js)
- **Expo CLI**: 
  ```bash
  npm install -g expo-cli
  ```

## ✅ STEP 2: Open Project in VS Code
```bash
code .
```

## ✅ STEP 3: Backend Setup & Run

### 3.1 Install Backend Dependencies
```bash
cd SmartQueue/backend
npm install
```

### 3.2 Configure Environment
A `.env` file has been created with:
- `PORT=5000`
- `MONGO_URI=mongodb://localhost:27017/smartqueue`
- `JWT_SECRET=secret123`

**For Production (MongoDB Atlas):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Get your MongoDB connection string
3. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartqueue
   ```

### 3.3 Start Backend
```bash
npm start
```

**Expected output:**
```
✅ SmartQueue backend running on http://localhost:5000
   Health check: http://localhost:5000/health
```

## ✅ STEP 4: Setup MongoDB

### Option A: Use Local MongoDB
1. Download & install: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The backend will auto-connect to `mongodb://localhost:27017/smartqueue`

### Option B: Use MongoDB Atlas (Recommended for Production)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string from "Drivers" tab
4. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartqueue
   ```

## ✅ STEP 5: Frontend Setup & Run (React Native + Expo)

### 5.1 Open New Terminal
```bash
cd SmartQueue/mobile
npm install
```

### 5.2 Configure API URL
The `.env.local` file has been created with:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

**Update for different devices:**

| Device | API URL |
|--------|---------|
| Web Browser (localhost) | `http://localhost:5000` |
| Android Emulator | `http://10.0.2.2:5000` |
| Android Physical Device | `http://YOUR_PC_IP:5000` * |
| iOS Simulator | `http://localhost:5000` |
| iOS Physical Device | `http://YOUR_PC_IP:5000` * |

*Replace `YOUR_PC_IP` with your computer's IP (run `ipconfig` in PowerShell)

### 5.3 Start Mobile App
```bash
npx expo start
```

## ✅ STEP 6: Run App

After running `npx expo start`, you'll see:
```
> Local:   http://localhost:19000
> Scan the QR code above with Expo Go! ▲ to open the app
```

### Option A: Run in Browser
Press `w` in the terminal

### Option B: Run on Physical Device
1. Install **Expo Go** app from App Store or Google Play
2. Open Expo Go
3. Scan the QR code shown in terminal

### Option C: Run on Emulator/Simulator
- Android: Press `a` in terminal
- iOS: Press `i` in terminal (macOS only)

## ⚠️ TROUBLESHOOTING

### Backend won't start
```bash
# Check port 5000 is not in use
# Or kill the process: netstat -ano | findstr :5000
```

### Mobile can't connect to backend
1. Make sure backend is running: `npm start` in backend folder
2. Check `.env.local` has correct `EXPO_PUBLIC_API_BASE_URL`
3. For physical devices: use your PC's IP address (run `ipconfig`)
4. Test backend is accessible: Open browser to `http://localhost:5000/health`

### MongoDB connection fails
1. Ensure MongoDB is running
2. Check `MONGO_URI` in `.env`
3. Fallback: Backend will use in-memory MongoDB (**data resets on restart**)

## 📂 Project Structure
```
SmartQueue/
├── backend/           # Express.js + MongoDB backend
│   ├── src/
│   ├── .env           # Backend configuration
│   └── package.json
├── mobile/            # Expo + React Native frontend
│   ├── app/           # App screens & routing
│   ├── .env.local     # Mobile configuration
│   └── package.json
```

## 🚀 Development Mode

### Auto-reload backend on file changes
```bash
cd SmartQueue/backend
npm run dev
```

### Switch between web/mobile in frontend
```bash
cd SmartQueue/mobile
npx expo start    # Shows menu to pick platform
```

## ✅ All Set!
Your SmartQueue project is ready. Start with backend, then frontend in separate terminals.

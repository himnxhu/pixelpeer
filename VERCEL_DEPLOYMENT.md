# Vercel Deployment Guide for PixelMeet

## ⚠️ Important Limitation

**Vercel does not support persistent WebSocket connections** required for real-time video chat functionality. This is a significant limitation because:

- WebRTC signaling requires persistent connections
- Real-time chat messaging needs WebSocket support
- Peer-to-peer matching relies on server-side connection state

## Alternative Deployment Options (Recommended)

### 1. Railway (Recommended for WebRTC)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Benefits:**
- ✅ Full WebSocket support
- ✅ Persistent connections
- ✅ Real-time video chat works perfectly
- ✅ Easy deployment with Git integration

### 2. Render
```bash
# Connect GitHub repo to Render
# Set build command: npm run build
# Set start command: npm start
```

**Benefits:**
- ✅ WebSocket support
- ✅ Free tier available
- ✅ Automatic deployments from Git

### 3. DigitalOcean App Platform
```bash
# Connect GitHub repo
# Configure as Node.js app
# Set run command: npm start
```

### 4. Traditional VPS (Full Control)
```bash
# Deploy to any VPS with Node.js
npm run build
npm start
```

## Vercel Static Deployment (Limited Functionality)

If you must use Vercel, you can deploy a **static version** with these limitations:

### What Works:
- ✅ Modern UI and design
- ✅ Camera/microphone access
- ✅ Frontend video interface

### What Doesn't Work:
- ❌ Real-time peer matching
- ❌ WebRTC signaling server
- ❌ Chat messaging
- ❌ Video chat functionality

### Static Deployment Steps:

1. **Update package.json scripts:**
```json
{
  "scripts": {
    "build": "vite build",
    "build:static": "vite build --mode static"
  }
}
```

2. **Create vercel.json** (already created above)

3. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

4. **Configure build settings in Vercel dashboard:**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

## Recommended Solution: Use Railway

Since PixelMeet requires WebSocket support for full functionality, I recommend deploying to **Railway**:

### Railway Deployment (Full Functionality)

1. **Create railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

2. **Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

3. **Configure environment variables in Railway dashboard:**
   - `NODE_ENV=production`
   - `PORT` (automatically set by Railway)

### Benefits of Railway:
- ✅ **Full WebSocket support** - Real-time video chat works
- ✅ **Persistent connections** - WebRTC signaling works perfectly
- ✅ **Easy Git integration** - Automatic deployments
- ✅ **Free tier available** - Great for testing
- ✅ **Custom domains** - Professional deployment
- ✅ **HTTPS by default** - Required for WebRTC in production

## Alternative: Use WebRTC with STUN/TURN Servers

If you absolutely need Vercel, you could modify the app to use:

1. **External WebSocket service** (like Pusher or Socket.IO service)
2. **STUN/TURN servers** for direct peer connections
3. **Firebase Realtime Database** for signaling

But this would require significant architectural changes.

## Conclusion

**For the best user experience with full video chat functionality, use Railway or Render instead of Vercel.**

The current PixelMeet application is designed as a real-time video chat platform that requires persistent server connections. Vercel's serverless architecture is not compatible with this type of application.

If you need help setting up deployment on Railway or another platform that supports WebSockets, I can guide you through the process!
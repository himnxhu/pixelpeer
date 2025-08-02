# PixelMeet - Quick Local Setup Guide

## 🚀 Ready-to-Use Package Created!

I've created a complete export package with all the files you need to run PixelMeet on your local machine.

## 📦 What's Included

The `pixelmeet-export` directory contains:
- All React components with modern UI
- WebRTC video chat functionality  
- Real-time messaging system
- Complete backend with WebSocket support
- All configuration files
- Setup scripts and documentation

## 💻 Local Setup (3 Simple Steps)

### Option 1: Download Export Package
1. **Copy the `pixelmeet-export` folder** from this Replit to your local machine
2. **Navigate to the folder**: `cd pixelmeet-export`
3. **Run setup**: `./setup.sh` (or `npm install && npm run dev`)

### Option 2: Manual Setup
1. **Create new project folder** on your local machine
2. **Copy these key files** from this Replit:
   - All files in `client/src/` directory
   - All files in `server/` directory  
   - `shared/schema.ts`
   - Configuration files: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`
3. **Create package.json** with the dependencies (see DOWNLOAD_INSTRUCTIONS.md)
4. **Install and run**: `npm install && npm run dev`

## 🔧 Required Dependencies

```bash
# Core dependencies
npm install react react-dom vite @vitejs/plugin-react typescript
npm install express ws tsx @types/express @types/ws @types/node
npm install simple-peer @types/simple-peer
npm install tailwindcss @tailwindcss/vite autoprefixer
npm install lucide-react wouter @tanstack/react-query
npm install zod drizzle-orm drizzle-zod
npm install class-variance-authority clsx tailwind-merge
```

## 🧪 Testing Video Chat Locally

1. Start server: `npm run dev`
2. Open browser: `http://localhost:5000`
3. **Open multiple tabs** to test video chat
4. Allow camera/microphone permissions
5. Click "Start Chatting" in both tabs
6. The app will automatically connect the sessions

## 🌐 Browser Requirements

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## 📁 Project Structure

```
pixelmeet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # React hooks
│   │   ├── pages/          # App pages
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry
│   ├── routes.ts          # WebSocket routes
│   ├── storage.ts         # Data management
│   └── vite.ts            # Dev server
├── shared/                 # Shared types
└── config files...
```

## 🔥 Features Working Locally

✅ **Real-time video chat** with WebRTC  
✅ **Instant messaging** alongside video  
✅ **Modern dark UI** optimized for video  
✅ **Automatic peer matching** system  
✅ **Audio/video controls** (mute/unmute)  
✅ **Connection management** with retry logic  
✅ **Responsive design** for all screen sizes  
✅ **Production-ready** for deployment  

## 🚀 Deployment Options

**Vercel**: Connect your Git repo and deploy automatically  
**Netlify**: Upload build folder or connect Git  
**Traditional hosting**: Run `npm run build` and deploy dist folder  

## ❓ Need Help?

Check the detailed guides:
- `LOCAL_SETUP.md` - Complete setup instructions
- `DOWNLOAD_INSTRUCTIONS.md` - Step-by-step download guide  
- `README.md` - Full project documentation

The exported package includes everything needed to run the complete PixelMeet video chat application locally with the same functionality as the Replit version!
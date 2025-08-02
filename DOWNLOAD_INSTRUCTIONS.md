# Download Instructions for Local Setup

## Method 1: Manual File Copy (Recommended)

### Step 1: Create Project Structure
Create a new directory on your local machine and set up this structure:

```
pixelmeet/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   └── index.html
├── server/
├── shared/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json
```

### Step 2: Copy Key Files

**Essential files to copy from this Replit project:**

#### Root Configuration Files:
- `package.json` (with all current dependencies)
- `vite.config.ts`
- `tailwind.config.ts` 
- `tsconfig.json`
- `components.json`
- `drizzle.config.ts`
- `postcss.config.js`

#### Client Files:
- `client/index.html`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/index.css`
- All files in `client/src/components/`
- All files in `client/src/hooks/`
- All files in `client/src/pages/`
- All files in `client/src/lib/`

#### Server Files:
- `server/index.ts`
- `server/routes.ts`
- `server/storage.ts`
- `server/vite.ts`

#### Shared Files:
- `shared/schema.ts`

### Step 3: Install and Run

```bash
cd pixelmeet
npm install
npm run dev
```

## Method 2: Git Clone (Alternative)

If you've pushed the code to GitHub:

```bash
git clone https://github.com/himnxhu/omegle-clone.git
cd omegle-clone
npm install
npm run dev
```

## Local Package.json Template

Create this `package.json` file in your local project:

```json
{
  "name": "pixelmeet-video-chat",
  "version": "1.0.0",
  "description": "An optimized Omegle clone with enhanced UI/UX and WebRTC performance",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@neondatabase/serverless": "^0.10.5",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.3",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-context-menu": "^2.2.3",
    "@radix-ui/react-dialog": "^1.1.3",
    "@radix-ui/react-dropdown-menu": "^2.1.3",
    "@radix-ui/react-hover-card": "^1.1.3",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.3",
    "@radix-ui/react-navigation-menu": "^1.2.2",
    "@radix-ui/react-popover": "^1.1.3",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "@radix-ui/react-select": "^2.1.3",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.3",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.7",
    "@tanstack/react-query": "^5.62.7",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/node": "^22.10.2",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/simple-peer": "^9.11.8",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^4.1.0",
    "drizzle-kit": "^0.30.1",
    "drizzle-orm": "^0.38.2",
    "drizzle-zod": "^0.7.0",
    "embla-carousel-react": "^8.6.0",
    "esbuild": "^0.24.2",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.15.0",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.469.0",
    "memorystore": "^1.6.7",
    "nanoid": "^5.0.9",
    "next-themes": "^0.4.4",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "postcss": "^8.5.11",
    "react": "^18.3.1",
    "react-day-picker": "^9.4.4",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.8",
    "recharts": "^2.13.3",
    "simple-peer": "^9.11.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss": "^3.4.16",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.19.2",
    "tw-animate-css": "^0.3.1",
    "typescript": "^5.7.2",
    "vaul": "^1.1.2",
    "vite": "^6.0.5",
    "wouter": "^3.3.6",
    "ws": "^8.18.0",
    "zod": "^3.24.1",
    "zod-validation-error": "^3.4.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Vite Config for Local Setup

Create `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

## Quick Test

After setup:

1. Run `npm run dev`
2. Open `http://localhost:5000` in multiple browser tabs
3. Allow camera/microphone permissions
4. Click "Start Chatting" in both tabs
5. You should see the video chat connect

## Troubleshooting

### If camera doesn't work:
- Check browser permissions
- Try refreshing the page
- Ensure no other apps are using the camera

### If build fails:
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 18+
- Check file structure matches exactly

### If WebSocket fails:
- Check that port 5000 is available
- Verify no firewall blocking
- Check browser console for errors

## Production Deployment

For deploying to Vercel or other platforms:

1. Build: `npm run build`
2. Set environment variables if needed
3. Deploy the built files

The application is optimized for both local development and production deployment.
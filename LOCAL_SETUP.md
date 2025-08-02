# Local Development Setup Guide

This guide will help you run the PixelMeet video chat application on your local machine.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/himnxhu/omegle-clone.git
   cd omegle-clone
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5000`
   - Open multiple tabs to test video chat

## Dependencies You'll Need

Copy the dependencies from the current `package.json` file in this project. The main dependencies include:

### Frontend Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^6.0.5",
  "@vitejs/plugin-react": "^4.3.4",
  "typescript": "^5.7.2",
  "tailwindcss": "^3.4.16",
  "simple-peer": "^9.11.1",
  "wouter": "^3.3.6",
  "@tanstack/react-query": "^5.62.7",
  "@types/simple-peer": "^9.11.8"
}
```

### Backend Dependencies
```json
{
  "express": "^4.21.2",
  "ws": "^8.18.0",
  "tsx": "^4.19.2",
  "@types/express": "^5.0.0",
  "@types/ws": "^8.5.13",
  "@types/node": "^22.10.2",
  "drizzle-orm": "^0.38.2",
  "zod": "^3.24.1"
}
```

### UI Components
```json
{
  "lucide-react": "^0.469.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.5"
}
```

## Project Structure for Local Setup

When setting up locally, ensure your project structure matches:

```
your-project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json
```

## Configuration Files You'll Need

### package.json Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "server", "shared"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
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

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

## Environment Variables (Optional)

Create a `.env` file in your project root:

```bash
# Optional: Custom port (defaults to 5000)
PORT=5000

# Optional: Database URL (uses in-memory by default)
DATABASE_URL=postgresql://username:password@localhost:5432/pixelmeet
```

## Testing Locally

1. **Start the server**: `npm run dev`
2. **Open multiple browser tabs** at `http://localhost:5000`
3. **Allow camera/microphone permissions** in each tab
4. **Click "Start Chatting"** in both tabs
5. **The app will automatically connect the two sessions**

## Troubleshooting

### Port Issues
- Ensure port 5000 is available
- Change PORT in .env if needed

### Camera/Microphone
- Allow browser permissions
- Check if other apps are using the camera
- Try refreshing the page

### Build Issues
- Delete node_modules and run `npm install` again
- Ensure Node.js version is 18+
- Check that all files are in correct locations

### WebSocket Connection
- Verify the server is running
- Check browser console for errors
- Ensure no firewall blocking the connection

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Browser Compatibility

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

Note: WebRTC requires HTTPS in production but works with HTTP locally.

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure Node.js version is compatible
4. Try the troubleshooting steps above
#!/usr/bin/env node

/**
 * Export Script for PixelMeet Local Setup
 * 
 * This script helps export the project structure and files
 * needed to run the PixelMeet application locally.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = 'pixelmeet-export';

// List of files and directories to export
const filesToExport = [
  // Client files
  'client/src/components/video-call-interface.tsx',
  'client/src/components/welcome-screen.tsx',
  'client/src/components/connection-modal.tsx',
  'client/src/components/chat-panel.tsx',
  'client/src/components/ui', // entire ui directory
  'client/src/hooks/use-socket.tsx',
  'client/src/hooks/use-webrtc.tsx',
  'client/src/hooks/use-mobile.tsx',
  'client/src/hooks/use-toast.ts',
  'client/src/lib/queryClient.ts',
  'client/src/lib/utils.ts',
  'client/src/lib/peer-connection.ts',
  'client/src/pages/home.tsx',
  'client/src/pages/not-found.tsx',
  'client/src/App.tsx',
  'client/src/main.tsx',
  'client/src/index.css',
  'client/index.html',
  
  // Server files
  'server/index.ts',
  'server/routes.ts',
  'server/storage.ts',
  'server/vite.ts',
  
  // Shared files
  'shared/schema.ts',
  
  // Config files
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'components.json',
  'drizzle.config.ts',
  'postcss.config.js',
  
  // Documentation
  'README.md',
  'LOCAL_SETUP.md'
];

// Configuration templates
const packageJsonTemplate = {
  "name": "pixelmeet-video-chat",
  "version": "1.0.0",
  "description": "An optimized Omegle clone with enhanced UI/UX and WebRTC performance",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
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
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      const destDir = path.dirname(dest);
      ensureDirectoryExists(destDir);
      
      if (fs.statSync(src).isDirectory()) {
        copyDirectory(src, dest);
      } else {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied: ${src} -> ${dest}`);
      }
    } else {
      console.log(`⚠ File not found: ${src}`);
    }
  } catch (error) {
    console.error(`✗ Error copying ${src}:`, error.message);
  }
}

function copyDirectory(src, dest) {
  ensureDirectoryExists(dest);
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  console.log(`✓ Copied directory: ${src} -> ${dest}`);
}

function createPackageJson() {
  const packageJsonPath = path.join(OUTPUT_DIR, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonTemplate, null, 2));
  console.log(`✓ Created: package.json`);
}

function createSetupScript() {
  const setupScript = `#!/bin/bash

# PixelMeet Local Setup Script

echo "🚀 Setting up PixelMeet locally..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! To start the development server:"
    echo "   npm run dev"
    echo ""
    echo "Then open http://localhost:5000 in your browser"
    echo "Open multiple tabs to test the video chat functionality"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
`;

  const setupPath = path.join(OUTPUT_DIR, 'setup.sh');
  fs.writeFileSync(setupPath, setupScript);
  fs.chmodSync(setupPath, '755');
  console.log(`✓ Created: setup.sh`);
}

function main() {
  console.log('📦 Exporting PixelMeet project for local setup...\n');
  
  // Create output directory
  ensureDirectoryExists(OUTPUT_DIR);
  
  // Copy all files
  filesToExport.forEach(file => {
    const src = file;
    const dest = path.join(OUTPUT_DIR, file);
    copyFile(src, dest);
  });
  
  // Create package.json
  createPackageJson();
  
  // Create setup script
  createSetupScript();
  
  console.log(`\n✅ Export complete! Files are in the '${OUTPUT_DIR}' directory`);
  console.log('\nTo set up locally:');
  console.log(`1. Copy the '${OUTPUT_DIR}' directory to your local machine`);
  console.log('2. Run: cd pixelmeet-export');
  console.log('3. Run: ./setup.sh (or npm install)');
  console.log('4. Run: npm run dev');
  console.log('5. Open http://localhost:5000');
}

main();
# PixelMeet - Random Video Chat Application

An optimized Omegle clone with enhanced UI/UX, improved WebRTC performance, and deployment compatibility for both local development and Vercel.

## Features

- **Real-time Video Chat**: WebRTC-powered peer-to-peer video communication
- **Instant Messaging**: Real-time text chat alongside video calls
- **Modern UI**: Dark-themed, responsive design optimized for video chatting
- **Random Matching**: Automatic peer matching system
- **Media Controls**: Toggle video/audio, fullscreen support
- **Connection Management**: Automatic reconnection and error handling
- **Cross-platform**: Works on desktop and mobile browsers

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **WebRTC** for peer-to-peer video/audio
- **simple-peer** for WebRTC abstraction
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **WebSocket (ws)** for real-time signaling
- **Drizzle ORM** for database operations
- **PostgreSQL** (configurable, defaults to in-memory storage)

## Local Development Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for cloning the repository

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/himnxhu/omegle-clone.git
   cd omegle-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   Create a `.env` file in the root directory:
   ```bash
   # Optional: Database configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/pixelmeet
   
   # Optional: Custom port (defaults to 5000)
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

### Testing Video Chat

To test the video chat functionality locally:

1. Open two browser tabs/windows at `http://localhost:5000`
2. Allow camera and microphone permissions in both tabs
3. Click "Start Chatting" in both tabs
4. The application will automatically match the two sessions

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application pages
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket handling
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite development server setup
├── shared/                 # Shared types and schemas
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## Browser Compatibility

- **Chrome** 90+ (recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

**Note**: WebRTC requires HTTPS in production. For local development, HTTP is supported.

## Deployment

### Vercel Deployment

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables** (if using database):
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Deploy** - Vercel will automatically build and deploy your application

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=5000
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Camera/Microphone not working**
   - Ensure browser permissions are granted
   - Check if other applications are using the camera
   - Try refreshing the page

2. **WebSocket connection fails**
   - Check if port 5000 is available
   - Verify firewall settings
   - Ensure the server is running

3. **Peer connection fails**
   - Check your network configuration
   - Ensure STUN servers are accessible
   - Try disabling VPN if enabled

### Development Tips

- **Hot Reload**: The development server supports hot module replacement
- **Debug Mode**: Open browser DevTools to see WebRTC connection logs
- **Multiple Tabs**: Test locally by opening multiple browser tabs
- **Network**: For testing across devices, use your local IP address

## Architecture Overview

The application uses a hybrid architecture:

1. **HTTP Server**: Express.js serves the React frontend and API endpoints
2. **WebSocket Server**: Handles real-time signaling for WebRTC
3. **Peer-to-Peer**: Direct WebRTC connections for video/audio streams
4. **Room Management**: Server manages user matching and room lifecycle

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Ensure you're using a supported browser version
# Overview

This is a real-time video chat application called "PixelMeet" that connects random users for video conversations. The application is built as a full-stack web app using React on the frontend and Express with WebSocket support on the backend. It allows users to have anonymous video chats with strangers, similar to platforms like Omegle or Chatroulette.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses **React with TypeScript** and follows a component-based architecture:

- **UI Framework**: Built with shadcn/ui components providing a consistent design system with Radix UI primitives
- **Styling**: TailwindCSS with custom CSS variables for theming support (light/dark modes)
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

The application structure includes:
- **Pages**: Home page and 404 not found page
- **Components**: Reusable UI components including video interface, chat panel, welcome screen, and connection modals
- **Hooks**: Custom hooks for WebSocket connections, WebRTC functionality, and mobile detection
- **Utilities**: Helper functions and query client configuration

## Backend Architecture

The backend is built with **Express.js** and follows a REST API + WebSocket hybrid architecture:

- **HTTP Server**: Express.js for serving static files and handling HTTP requests
- **Real-time Communication**: WebSocket server for signaling and chat messaging
- **WebRTC Support**: Peer-to-peer video/audio communication with fallback STUN servers
- **Session Management**: In-memory storage for active rooms and user sessions
- **Database Integration**: Drizzle ORM configured for PostgreSQL (though currently using in-memory storage)

Key architectural decisions:
- **Hybrid Communication**: HTTP for initial connection, WebSocket for real-time signaling
- **Peer-to-Peer Video**: WebRTC for direct video/audio streams between users
- **Room-based Matching**: Users are matched into rooms with peer1/peer2 structure
- **Graceful Fallbacks**: Connection retry logic and error handling

## Data Storage Solutions

The application uses a **flexible storage abstraction**:

- **Current Implementation**: In-memory storage using Maps for development/testing
- **Production Ready**: Drizzle ORM with PostgreSQL schema defined
- **Database Schema**: Users, rooms, and messages tables with proper relationships
- **Migration Support**: Drizzle Kit for database migrations and schema management

The storage interface supports:
- User management (creation, lookup by username/ID)
- Room lifecycle management (creation, matching, deactivation)
- Message persistence for chat history
- Active room tracking for matchmaking

## Authentication and Authorization

Currently implements a **simple session-based approach**:
- No complex authentication system implemented yet
- Room-based access control through WebSocket connection IDs
- Anonymous user sessions identified by generated UUIDs
- Future-ready for user registration/login system with password hashing

## External Dependencies

### Core Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Components**: Radix UI primitives, shadcn/ui component library
- **Styling**: TailwindCSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query for server state

### Core Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **WebSocket**: ws library for WebSocket server implementation
- **Database**: Drizzle ORM, @neondatabase/serverless for PostgreSQL
- **Development**: tsx for TypeScript execution, Vite for frontend builds

### WebRTC and Media Dependencies
- **WebRTC**: simple-peer for WebRTC abstraction
- **Media Handling**: Native Web APIs (getUserMedia, RTCPeerConnection)
- **STUN Servers**: Google's public STUN servers for NAT traversal

### Development and Build Tools
- **Build System**: Vite with React plugin, esbuild for server bundling
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development**: Replit-specific plugins for development environment
- **Code Quality**: ESLint configuration, Prettier formatting

### Third-party Services
- **STUN Servers**: stun.l.google.com and stun1.l.google.com for WebRTC connectivity
- **Database**: Configured for Neon PostgreSQL (via environment variable)
- **CDN**: Replit banner script for development environment indication
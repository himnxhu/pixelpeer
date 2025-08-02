/**
 * Vercel-compatible signaling using Socket.IO service or Firebase
 * This is a workaround for Vercel's lack of WebSocket support
 */

// import { io, Socket } from 'socket.io-client'; // Uncomment when using external Socket.IO service

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'peer-found' | 'peer-disconnected';
  data?: any;
  roomId?: string;
  senderId?: string;
}

export class VercelSignaling {
  private socket: any | null = null;
  private roomId: string | null = null;
  private peerId: string | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(private signalServerUrl: string) {
    // Use external Socket.IO service (like Socket.IO's hosted service)
    // or Firebase Realtime Database for signaling
  }

  async connect(): Promise<void> {
    try {
      // For Vercel deployment, use external Socket.IO service
      // Example: https://socket.io/docs/v4/client-api/
      this.socket = io(this.signalServerUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to signaling server');
        this.peerId = this.socket?.id || this.generateId();
      });

      this.socket.on('message', (message: SignalingMessage) => {
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message.data);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from signaling server');
      });

    } catch (error) {
      console.error('Failed to connect to signaling server:', error);
      // Fallback to direct peer-to-peer with STUN servers only
      throw new Error('Signaling server unavailable. Cannot establish peer connections.');
    }
  }

  async findPeer(): Promise<void> {
    if (!this.socket) {
      throw new Error('Not connected to signaling server');
    }

    // Request to find a peer
    this.socket.emit('find-peer', { peerId: this.peerId });
  }

  async sendOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.socket || !this.roomId) return;
    
    this.socket.emit('webrtc-signal', {
      type: 'offer',
      data: offer,
      roomId: this.roomId,
      senderId: this.peerId
    });
  }

  async sendAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.socket || !this.roomId) return;
    
    this.socket.emit('webrtc-signal', {
      type: 'answer',
      data: answer,
      roomId: this.roomId,
      senderId: this.peerId
    });
  }

  async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (!this.socket || !this.roomId) return;
    
    this.socket.emit('webrtc-signal', {
      type: 'ice-candidate',
      data: candidate,
      roomId: this.roomId,
      senderId: this.peerId
    });
  }

  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomId = null;
    this.peerId = null;
    this.messageHandlers.clear();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Alternative: Firebase Realtime Database signaling
export class FirebaseSignaling {
  private database: any; // Firebase database instance
  private roomRef: any;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(firebaseConfig: any) {
    // Initialize Firebase
    // This would require Firebase SDK
    console.log('Firebase signaling not implemented yet');
  }

  // Implement similar methods using Firebase Realtime Database
  // for signaling when external Socket.IO service is not available
}

// Default configuration for external services
export const SIGNALING_CONFIG = {
  // Socket.IO hosted service or your own Socket.IO server
  socketIO: 'wss://your-socket-io-server.herokuapp.com',
  
  // Firebase config (if using Firebase signaling)
  firebase: {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  },
  
  // STUN/TURN servers for WebRTC
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add TURN servers for better connectivity
    // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
  ]
};
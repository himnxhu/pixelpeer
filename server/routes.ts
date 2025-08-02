import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";

interface ClientSocket extends WebSocket {
  id: string;
  roomId?: string;
  peerId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<string, ClientSocket>();
  const waitingQueue: string[] = [];

  wss.on('connection', (ws: ClientSocket) => {
    ws.id = generateId();
    clients.set(ws.id, ws);

    console.log(`Client ${ws.id} connected`);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleWebSocketMessage(ws, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log(`Client ${ws.id} disconnected`);
      handleClientDisconnect(ws);
      clients.delete(ws.id);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${ws.id}:`, error);
    });
  });

  async function handleWebSocketMessage(ws: ClientSocket, message: any) {
    switch (message.type) {
      case 'find-peer':
        await handleFindPeer(ws);
        break;
      
      case 'webrtc-offer':
      case 'webrtc-answer':
      case 'webrtc-ice-candidate':
        await handleWebRTCSignaling(ws, message);
        break;
      
      case 'chat-message':
        await handleChatMessage(ws, message);
        break;
      
      case 'disconnect':
        await handleDisconnect(ws);
        break;
      
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  async function handleFindPeer(ws: ClientSocket) {
    // Try to find an available room
    let room = await storage.findAvailableRoom();
    
    if (room) {
      // Join existing room as peer2
      const updatedRoom = await storage.updateRoom(room.id, { peer2: ws.id });
      if (updatedRoom) {
        ws.roomId = updatedRoom.id;
        ws.peerId = 'peer2';
        
        // Notify both peers
        const peer1 = clients.get(updatedRoom.peer1!);
        if (peer1 && peer1.readyState === WebSocket.OPEN) {
          peer1.send(JSON.stringify({ 
            type: 'peer-found', 
            roomId: updatedRoom.id, 
            peerId: 'peer1',
            remotePeerId: ws.id
          }));
        }
        
        ws.send(JSON.stringify({ 
          type: 'peer-found', 
          roomId: updatedRoom.id, 
          peerId: 'peer2',
          remotePeerId: updatedRoom.peer1
        }));
      }
    } else {
      // Create new room and wait for peer2
      room = await storage.createRoom({ peer1: ws.id, peer2: null });
      ws.roomId = room.id;
      ws.peerId = 'peer1';
      
      ws.send(JSON.stringify({ 
        type: 'waiting-for-peer', 
        roomId: room.id,
        peerId: 'peer1'
      }));
    }
  }

  async function handleWebRTCSignaling(ws: ClientSocket, message: any) {
    if (!ws.roomId) return;
    
    const room = await storage.getRoom(ws.roomId);
    if (!room) return;
    
    const remotePeerId = ws.peerId === 'peer1' ? room.peer2 : room.peer1;
    if (!remotePeerId) return;
    
    const remotePeer = clients.get(remotePeerId);
    if (remotePeer && remotePeer.readyState === WebSocket.OPEN) {
      remotePeer.send(JSON.stringify({
        ...message,
        senderId: ws.id
      }));
    }
  }

  async function handleChatMessage(ws: ClientSocket, message: any) {
    if (!ws.roomId) return;
    
    try {
      const validatedMessage = insertMessageSchema.parse({
        roomId: ws.roomId,
        senderId: ws.id,
        content: message.content
      });
      
      const savedMessage = await storage.addMessage(validatedMessage);
      
      // Send to room participants
      const room = await storage.getRoom(ws.roomId);
      if (!room) return;
      
      const participants = [room.peer1, room.peer2].filter(Boolean);
      participants.forEach(peerId => {
        const peer = clients.get(peerId!);
        if (peer && peer.readyState === WebSocket.OPEN) {
          peer.send(JSON.stringify({
            type: 'chat-message',
            message: savedMessage
          }));
        }
      });
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  }

  async function handleDisconnect(ws: ClientSocket) {
    await handleClientDisconnect(ws);
  }

  async function handleClientDisconnect(ws: ClientSocket) {
    if (ws.roomId) {
      const room = await storage.getRoom(ws.roomId);
      if (room) {
        // Notify the other peer
        const otherPeerId = ws.peerId === 'peer1' ? room.peer2 : room.peer1;
        if (otherPeerId) {
          const otherPeer = clients.get(otherPeerId);
          if (otherPeer && otherPeer.readyState === WebSocket.OPEN) {
            otherPeer.send(JSON.stringify({ type: 'peer-disconnected' }));
            otherPeer.roomId = undefined;
            otherPeer.peerId = undefined;
          }
        }
        
        // Deactivate the room
        await storage.deactivateRoom(ws.roomId);
      }
    }
    
    // Remove from waiting queue
    const queueIndex = waitingQueue.indexOf(ws.id);
    if (queueIndex > -1) {
      waitingQueue.splice(queueIndex, 1);
    }
  }

  function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // REST API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return httpServer;
}

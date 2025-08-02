import { type User, type InsertUser, type Room, type Message, type InsertRoom, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRoom(room: InsertRoom): Promise<Room>;
  getRoom(id: string): Promise<Room | undefined>;
  updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined>;
  getActiveRooms(): Promise<Room[]>;
  findAvailableRoom(): Promise<Room | undefined>;
  addMessage(message: InsertMessage): Promise<Message>;
  getRoomMessages(roomId: string): Promise<Message[]>;
  deactivateRoom(roomId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rooms: Map<string, Room>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.messages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = { 
      id, 
      peer1: insertRoom.peer1 || null,
      peer2: insertRoom.peer2 || null,
      isActive: true,
      createdAt: new Date()
    };
    this.rooms.set(id, room);
    return room;
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async getActiveRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.isActive);
  }

  async findAvailableRoom(): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(
      room => room.isActive && room.peer1 && !room.peer2
    );
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      id,
      roomId: insertMessage.roomId || null,
      senderId: insertMessage.senderId || null,
      content: insertMessage.content,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.roomId === roomId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async deactivateRoom(roomId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (room) {
      room.isActive = false;
      this.rooms.set(roomId, room);
    }
  }
}

export const storage = new MemStorage();

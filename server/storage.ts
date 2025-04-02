import { messages, users, type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(minEthBurned?: number, sortBy?: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  incrementMessageViews(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    
    // Add some sample messages for development
    this.addSampleMessages();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessages(minEthBurned: number = 0, sortBy: string = "recent"): Promise<Message[]> {
    let filteredMessages = Array.from(this.messages.values()).filter(
      (message) => message.ethBurned >= minEthBurned
    );
    
    // Sort messages
    if (sortBy === "eth") {
      filteredMessages.sort((a, b) => b.ethBurned - a.ethBurned);
    } else if (sortBy === "views") {
      filteredMessages.sort((a, b) => b.views - a.views);
    } else {
      // Default sort by recent
      filteredMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    return filteredMessages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now, 
      verified: true, 
      views: 0 
    };
    this.messages.set(id, message);
    return message;
  }

  async incrementMessageViews(id: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.views += 1;
      this.messages.set(id, message);
    }
  }

  // Add sample messages for development
  private addSampleMessages() {
    const sampleMessages = [
      {
        id: this.messageCurrentId++,
        senderAddress: "0x71C...e2F9",
        content: "Climate change is the biggest challenge of our generation. We need to act now and develop sustainable solutions before it's too late. Join the movement!",
        ethBurned: 2.5,
        transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        verified: true,
        views: 1200
      },
      {
        id: this.messageCurrentId++,
        senderAddress: "0x3Ea...8b12",
        content: "Announcing a new open-source project to improve Ethereum scalability! Looking for contributors with experience in ZK-rollups. DM for details or check our GitHub.",
        ethBurned: 5.0,
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
        verified: true,
        views: 3400
      },
      {
        id: this.messageCurrentId++,
        senderAddress: "0x92F...7d42",
        content: "Education should be free and accessible to everyone. We're building a DAO to fund students globally. Visit edu-dao.eth to learn how you can help shape the future of learning.",
        ethBurned: 0.8,
        transactionHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        verified: true,
        views: 945
      },
      {
        id: this.messageCurrentId++,
        senderAddress: "vitalik.eth",
        content: "The future of Ethereum is bright. With the upcoming upgrades, we'll see significant improvements in scalability, security, and sustainability. The ecosystem is evolving faster than ever!",
        ethBurned: 10.0,
        transactionHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        verified: true,
        views: 12700
      }
    ];

    sampleMessages.forEach(message => {
      this.messages.set(message.id, message);
    });
  }
}

export const storage = new MemStorage();

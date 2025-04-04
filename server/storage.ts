import { type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { prisma } from './prisma';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(minEthBurned?: number, sortBy?: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  incrementMessageViews(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await prisma.user.create({
      data: insertUser
    });
    return user;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const message = await prisma.message.findUnique({
      where: { id }
    });
    return message || undefined;
  }

  async getMessages(minEthBurned: number = 0, sortBy: string = "recent"): Promise<Message[]> {
    let orderBy: any = {};
    
    if (sortBy === "eth") {
      orderBy = { ethBurned: 'desc' };
    } else {
      // Default is "recent" - sort by creation date
      orderBy = { createdAt: 'desc' };
    }
    
    const messages = await prisma.message.findMany({
      where: {
        ethBurned: {
          gte: minEthBurned
        }
      },
      orderBy
    });
    
    return messages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        ...insertMessage,
        verified: true,
        views: 0
      }
    });
    return message;
  }

  async incrementMessageViews(id: number): Promise<void> {
    await prisma.message.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });
  }

  // Method to seed the database with sample data if it's empty
  async seedDatabaseIfEmpty(): Promise<void> {
    const messageCount = await prisma.message.count();
    
    // Only seed if there are no messages
    if (messageCount === 0) {
      const sampleMessages = [
        {
          senderAddress: "0x71C...e2F9",
          content: "Climate change is the biggest challenge of our generation. We need to act now and develop sustainable solutions before it's too late. Join the movement!",
          ethBurned: 2.5,
          transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          verified: true,
          views: 1200
        },
        {
          senderAddress: "0x3Ea...8b12",
          content: "Announcing a new open-source project to improve Ethereum scalability! Looking for contributors with experience in ZK-rollups. DM for details or check our GitHub.",
          ethBurned: 5.0,
          transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
          verified: true,
          views: 3400
        },
        {
          senderAddress: "0x92F...7d42",
          content: "Education should be free and accessible to everyone. We're building a DAO to fund students globally. Visit edu-dao.eth to learn how you can help shape the future of learning.",
          ethBurned: 0.8,
          transactionHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          verified: true,
          views: 945
        },
        {
          senderAddress: "vitalik.eth",
          content: "The future of Ethereum is bright. With the upcoming upgrades, we'll see significant improvements in scalability, security, and sustainability. The ecosystem is evolving faster than ever!",
          ethBurned: 10.0,
          transactionHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          verified: true,
          views: 12700
        }
      ];

      await prisma.message.createMany({
        data: sampleMessages,
        skipDuplicates: true,
      });
      
      console.log("Database seeded with sample messages");
    }
  }
}

export const storage = new DatabaseStorage();

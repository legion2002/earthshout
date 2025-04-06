import {
  type User,
  type InsertUser,
  type Earthshout,
  type InsertEarthshout,
} from "@shared/schema";
import { prisma } from "./prisma";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEarthshout(id: number): Promise<Earthshout | undefined>;
  getEarthshouts(options?: {
    minAmount?: number;
    tokenAddress?: string;
    sortBy?: string;
  }): Promise<Earthshout[]>;
  createEarthshout(earthshout: InsertEarthshout): Promise<Earthshout>;
  getLatestIndexerState(
    chainId: number
  ): Promise<{ lastBlockNumber: number } | null>;
  updateIndexerState(chainId: number, lastBlockNumber: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await prisma.user.create({
      data: insertUser,
    });
    return user;
  }

  // Earthshout methods
  async getEarthshout(id: number): Promise<Earthshout | undefined> {
    const earthshout = await prisma.earthshout.findUnique({
      where: { id },
    });
    return earthshout || undefined;
  }

  async getEarthshouts(
    options: {
      minAmount?: number;
      tokenAddress?: string;
      sortBy?: string;
    } = {}
  ): Promise<Earthshout[]> {
    const { minAmount = 0, tokenAddress, sortBy = "recent" } = options;

    let orderBy: any = {};

    if (sortBy === "amount") {
      orderBy = { amountBurned: "desc" };
    } else {
      // Default is "recent" - sort by timestamp
      orderBy = { timestamp: "desc" };
    }

    const where: any = {
      amountBurned: {
        gte: minAmount,
      },
    };

    // Filter by token if specified
    if (tokenAddress) {
      where.tokenAddress = tokenAddress;
    }

    const earthshouts = await prisma.earthshout.findMany({
      where,
      orderBy,
    });

    return earthshouts;
  }

  async createEarthshout(
    insertEarthshout: InsertEarthshout
  ): Promise<Earthshout> {
    const earthshout = await prisma.earthshout.create({
      data: insertEarthshout,
    });
    return earthshout;
  }

  // Indexer methods
  async getLatestIndexerState(
    chainId: number
  ): Promise<{ lastBlockNumber: number } | null> {
    const state = await prisma.indexerState.findUnique({
      where: { chainId },
      select: { lastBlockNumber: true },
    });

    return state;
  }

  async updateIndexerState(
    chainId: number,
    lastBlockNumber: number
  ): Promise<void> {
    await prisma.indexerState.upsert({
      where: { chainId },
      update: {
        lastBlockNumber,
        updatedAt: new Date(),
      },
      create: {
        chainId,
        lastBlockNumber,
        updatedAt: new Date(),
      },
    });
  }

  // Method to seed the database with sample data if it's empty
  async seedDatabaseIfEmpty(): Promise<void> {
    try {
      console.log(
        "Attempting to connect to database with URL:",
        process.env.DATABASE_URL?.replace(/:.+@/, ":[PASSWORD]@")
      );
      const earthshoutCount = await prisma.earthshout.count();

      // Only seed if there are no earthshouts
      if (earthshoutCount === 0) {
        const sampleEarthshouts = [
          {
            senderAddress: "0x71C...e2F9",
            content:
              "Climate change is the biggest challenge of our generation. We need to act now and develop sustainable solutions before it's too late. Join the movement!",
            amountBurned: 2.5,
            transactionHash:
              "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
            yeetId: 0,
            blockNumber: 10000000,
          },
          {
            senderAddress: "0x3Ea...8b12",
            content:
              "Announcing a new open-source project to improve Ethereum scalability! Looking for contributors with experience in ZK-rollups. DM for details or check our GitHub.",
            amountBurned: 5.0,
            transactionHash:
              "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
            yeetId: 1,
            blockNumber: 10000100,
          },
          {
            senderAddress: "0x92F...7d42",
            content:
              "Education should be free and accessible to everyone. We're building a DAO to fund students globally. Visit edu-dao.eth to learn how you can help shape the future of learning.",
            amountBurned: 0.8,
            transactionHash:
              "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
            yeetId: 2,
            blockNumber: 10000200,
          },
          {
            senderAddress: "vitalik.eth",
            content:
              "The future of Ethereum is bright. With the upcoming upgrades, we'll see significant improvements in scalability, security, and sustainability. The ecosystem is evolving faster than ever!",
            amountBurned: 10.0,
            transactionHash:
              "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH
            yeetId: 3,
            blockNumber: 10000300,
          },
        ];

        await prisma.earthshout.createMany({
          data: sampleEarthshouts,
          skipDuplicates: true,
        });

        console.log("Database seeded with sample earthshouts");
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();

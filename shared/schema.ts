import { z } from "zod";
import { Prisma } from "@prisma/client";

// Export Prisma types
export type User = {
  id: number;
  username: string;
  password: string;
  walletAddress: string | null;
};

export type Message = {
  id: number;
  senderAddress: string;
  content: string;
  ethBurned: number;
  transactionHash: string;
  createdAt: Date;
  verified: boolean;
  views: number;
};

// Define insert schemas using Zod
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  walletAddress: z.string().max(42).optional().nullable(),
});

export const insertMessageSchema = z.object({
  senderAddress: z.string().max(42),
  content: z.string(),
  ethBurned: z.number(),
  transactionHash: z.string().max(66),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

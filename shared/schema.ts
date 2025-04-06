import { z } from "zod";

// Export Prisma types
export type User = {
  id: number;
  username: string;
  password: string;
  walletAddress: string | null;
};

export type Earthshout = {
  id: number;
  senderAddress: string;
  content: string | null;

  // On-chain data
  yeetId: number;
  tokenAddress: string;
  amountBurned: number;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;

  // Gift information (optional)
  recipientAddress: string | null;
  giftAmount: number | null;

  // Boost information
  boostForYeetId: number | null;
};

// Define insert schemas using Zod
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  walletAddress: z.string().max(42).optional().nullable(),
});

export const insertEarthshoutSchema = z.object({
  senderAddress: z.string().max(42),
  content: z.string().nullable().optional(),
  yeetId: z.number(),
  tokenAddress: z.string().max(42),
  amountBurned: z.number(),
  transactionHash: z.string().max(66),
  blockNumber: z.number(),
  timestamp: z
    .date()
    .optional()
    .default(() => new Date()),
  recipientAddress: z.string().max(42).nullable().optional(),
  giftAmount: z.number().nullable().optional(),
  boostForYeetId: z.number().nullable().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEarthshout = z.infer<typeof insertEarthshoutSchema>;

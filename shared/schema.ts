import { pgTable, text, serial, integer, varchar, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderAddress: varchar("sender_address", { length: 42 }).notNull(),
  content: text("content").notNull(),
  ethBurned: doublePrecision("eth_burned").notNull(),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verified: boolean("verified").default(true).notNull(),
  views: integer("views").default(0).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderAddress: true,
  content: true,
  ethBurned: true,
  transactionHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

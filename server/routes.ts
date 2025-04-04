import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed the database with sample data if it's empty
  if ('seedDatabaseIfEmpty' in storage) {
    await (storage as any).seedDatabaseIfEmpty();
  }
  // API routes for messages
  app.get("/api/messages", async (req, res) => {
    try {
      const minEthFilter = req.query.minEth ? parseFloat(req.query.minEth as string) : 0;
      const sortBy = req.query.sortBy as string || "recent";
      const messages = await storage.getMessages(minEthFilter, sortBy);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const message = await storage.getMessage(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      // Increment view count
      await storage.incrementMessageViews(id);
      res.json(message);
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.get("/api/eth-price", async (_req, res) => {
    try {
      // In a real app, we would fetch the ETH price from an API like CoinGecko
      // For this demo, we'll return a hardcoded value
      res.json({ usd: 3500 });
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      res.status(500).json({ message: "Failed to fetch ETH price" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

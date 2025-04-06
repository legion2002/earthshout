import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEarthshoutSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed the database with sample data if it's empty
  if ("seedDatabaseIfEmpty" in storage) {
    await (storage as any).seedDatabaseIfEmpty();
  }

  // API routes for earthshouts
  app.get("/api/earthshouts", async (req, res) => {
    try {
      const minAmount = req.query.minAmount
        ? parseFloat(req.query.minAmount as string)
        : 0;
      const tokenAddress = (req.query.tokenAddress as string) || undefined;
      const sortBy = (req.query.sortBy as string) || "recent";

      const earthshouts = await storage.getEarthshouts({
        minAmount,
        tokenAddress,
        sortBy,
      });

      res.json(earthshouts);
    } catch (error) {
      console.error("Error fetching earthshouts:", error);
      res.status(500).json({ message: "Failed to fetch earthshouts" });
    }
  });

  app.get("/api/earthshouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid earthshout ID" });
      }

      const earthshout = await storage.getEarthshout(id);
      if (!earthshout) {
        return res.status(404).json({ message: "Earthshout not found" });
      }

      res.json(earthshout);
    } catch (error) {
      console.error("Error fetching earthshout:", error);
      res.status(500).json({ message: "Failed to fetch earthshout" });
    }
  });

  app.post("/api/earthshouts", async (req, res) => {
    try {
      const earthshoutData = insertEarthshoutSchema.parse(req.body);
      const newEarthshout = await storage.createEarthshout(earthshoutData);
      res.status(201).json(newEarthshout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid earthshout data", errors: error.errors });
      }
      console.error("Error creating earthshout:", error);
      res.status(500).json({ message: "Failed to create earthshout" });
    }
  });

  app.get("/api/token-prices", async (req, res) => {
    try {
      // In a real app, we would fetch token prices from an API
      // For this demo, we'll return hardcoded values
      res.json({
        "0x0000000000000000000000000000000000000000": 3500, // ETH price in USD
        // Add other token prices as needed
      });
    } catch (error) {
      console.error("Error fetching token prices:", error);
      res.status(500).json({ message: "Failed to fetch token prices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

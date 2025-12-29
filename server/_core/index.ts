import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Clerk Webhooks
  const clerkWebhookRoutes = (await import("../routes/clerk-webhook.routes")).default;
  app.use("/api/webhooks/clerk", clerkWebhookRoutes);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Voice Call routes (WebRTC)
  const voiceCallRoutes = (await import("../routes/voice-call.routes")).default;
  app.use("/api/voice-call", voiceCallRoutes);

  // Moderation routes
  // Moderation routes
  const moderationRoutes = (await import("../routes/moderation.routes")).default;
  app.use("/api/moderation", moderationRoutes);

  // Super Like routes
  const superLikeRoutes = (await import("../routes/super-like.routes")).default;
  app.use("/api/super-like", superLikeRoutes);

  // Vet AI routes
  const vetAiRoutes = (await import("../routes/vet-ai.routes")).default;
  app.use("/api/vet-ai", vetAiRoutes);

  // Audio/Voice routes
  const audioRoutes = (await import("../routes/audio.routes")).default;
  app.use("/api/audio", audioRoutes);
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

import { createServer } from "node:http";
import next from "next";
import { Server as ServerIO } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Initialize the Next.js production/development engine
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Initialize Socket.io directly onto the Node HTTP Server
  const io = new ServerIO(httpServer, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*", // Adjust for security preferences during production deployment
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Listen for direct message emissions from clients
    socket.on("message:send", (data) => {
      io.to(data.channelId).emit("message:receive", data);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> App Router Server running at http://${hostname}:${port}`);
  });
});

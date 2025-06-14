import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIO } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";      // optional
import { verifyJwtSocket } from "./middlewares/verifyJwtSocket.js";
import { handleSocket } from "./services/wsService.js";

dotenv.config();
const app = express();

// ── Express middlewares ─────────────────────────────
app.use(cors());
app.use(express.json());

// ── REST routes ─────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes); // e.g. GET /history (optional)

// ── HTTP + WebSocket server ─────────────────────────
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: { origin: "*" },        // 🔐 tighten in production
});

// Auth gate for every socket connection
io.use(async (socket, next) => {
  try {
    // Client should send { auth: { token: IdToken } }
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    socket.user = await verifyJwtSocket(token); // attach user info
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// Main socket handler
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.user.email);
  handleSocket(io, socket);
});

// ── Start server ────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

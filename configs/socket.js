const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  const FRONTEND_URLS = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim());

  io = new Server(server, {
    cors: {
      origin: FRONTEND_URLS,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("connected:", socket.id, "user:", socket.user?.id);

    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    socket.on("join-workspace", ({ workspace_id, team_id }) => {
      if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
      }
      const room = `workspace:${workspace_id}:team:${team_id}`;
      socket.join(room);
      socket.currentRoom = room;
    });

    socket.on("leave-workspace", ({ workspace_id, team_id }) => {
      const room = `workspace:${workspace_id}:team:${team_id}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };

const { Server } = require("socket.io");

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

  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    // Join a workspace+team room
    socket.on("join-workspace", ({ workspace_id, team_id }) => {
      const room = `workspace:${workspace_id}:team:${team_id}`;
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
    });

    // Leave a workspace+team room
    socket.on("leave-workspace", ({ workspace_id, team_id }) => {
      const room = `workspace:${workspace_id}:team:${team_id}`;
      socket.leave(room);
      console.log(`${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };

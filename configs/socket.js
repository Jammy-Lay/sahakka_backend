const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const team = require("../models/user/team");
const workspace = require("../models/user/workspace");

let io;

const isMember = async (userId, workspaceId, teamId) => {
  if (!userId || !workspaceId || !teamId) return false;

  const teamRow = await team.checkTeamInWorkspace(teamId, workspaceId);
  if (!teamRow || teamRow.length === 0) return false;

  const workspaceRole = await workspace.checkWorkspaceMember(
    userId,
    workspaceId,
  );
  if (workspaceRole?.[0]?.role === "owner") return true;

  const teamMember = await team.checkTeamMember(userId, teamId);
  return teamMember && teamMember.length > 0;
};

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

    socket.on("join-workspace", async ({ workspace_id, team_id }) => {
      try {
        if (!workspace_id || !team_id) {
          return socket.emit("error", {
            message: "Missing workspace_id or team_id",
          });
        }

        const allowed = await isMember(socket.user?.id, workspace_id, team_id);
        if (!allowed) {
          return socket.emit("error", {
            message: "Not authorized for this workspace",
          });
        }

        if (socket.currentRoom) {
          socket.leave(socket.currentRoom);
        }

        const room = `workspace:${workspace_id}:team:${team_id}`;
        socket.join(room);
        socket.currentRoom = room;
      } catch (err) {
        console.error("join-workspace error:", err);
        socket.emit("error", { message: "Failed to join workspace" });
      }
    });

    socket.on("leave-workspace", ({ workspace_id, team_id }) => {
      try {
        if (!workspace_id || !team_id) return;
        const room = `workspace:${workspace_id}:team:${team_id}`;
        socket.leave(room);
        if (socket.currentRoom === room) {
          socket.currentRoom = null;
        }
      } catch (err) {
        console.error("leave-workspace error:", err);
      }
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

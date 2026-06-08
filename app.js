const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          FRONTEND_URL,
          BASE_URL,
          "http://localhost:3000",
          "http://localhost:5173",
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", FRONTEND_URL, BASE_URL],
      },
    },
  }),
);

app.use(
  cors({
    origin: [FRONTEND_URL, BASE_URL],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    result: true,
    message: "Server is running",
  });
});

const { apiLimiter } = require("./middlewares/rateLimit");
app.use("/api", apiLimiter);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Credentials", "true");
    },
  }),
);

const admin = require("./routes/admin/admin");
app.use("/api/sahakka-admin", admin);

const auth = require("./routes/auth");
app.use("/api", auth);

const profile = require("./routes/profile/profile");
app.use("/api", profile);

const workspace = require("./routes/user/workspace");
app.use("/api", workspace);

const team = require("./routes/user/team");
app.use("/api", team);

const task = require("./routes/user/task");
app.use("/api", task);

const invite = require("./routes/user/invite");
app.use("/api", invite);

const submission = require("./routes/user/submission");
app.use("/api", submission);

const document = require("./routes/user/document");
app.use("/api", document);

app.use(require("./routes/demo"));

const server = http.createServer(app);

const { initSocket } = require("./configs/socket");
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on 3000");
});

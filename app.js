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

app.options(
  /.*/,
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", FRONTEND_URL, BASE_URL],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", FRONTEND_URL, BASE_URL],
      },
    },
  }),
);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/sahakka-api/v2", apiLimiter);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      res.set("Access-Control-Allow-Origin", FRONTEND_URL);
      res.set("Access-Control-Allow-Credentials", "true");
    },
  }),
);

const admin = require("./routes/admin/admin");
app.use("/sahakka-api/v2/sahakka-admin", admin);

const auth = require("./routes/auth");
app.use("/sahakka-api/v2", auth);

const profile = require("./routes/profile/profile");
app.use("/sahakka-api/v2", profile);

const workspace = require("./routes/user/workspace");
app.use("/sahakka-api/v2", workspace);

const team = require("./routes/user/team");
app.use("/sahakka-api/v2", team);

const task = require("./routes/user/task");
app.use("/sahakka-api/v2", task);

const invite = require("./routes/user/invite");
app.use("/sahakka-api/v2", invite);

const submission = require("./routes/user/submission");
app.use("/sahakka-api/v2", submission);

const document = require("./routes/user/document");
app.use("/sahakka-api/v2", document);

app.use(require("./routes/demo"));

const server = http.createServer(app);

const { initSocket } = require("./configs/socket");
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log("Server running on " + process.env.PORT);
});

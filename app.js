const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const helmet = require("helmet");
const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    result: true,
    message: "Server is running",
  });
});

const admin = require("./routes/admin/admin");
app.use("/api/admin", admin);

const { apiLimiter } = require("./middlewares/rateLimit");
app.use("/api", apiLimiter);

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
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);

const { initSocket } = require("./configs/socket");
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on 3000");
});

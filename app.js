const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
const profileRoute = require('./routes/profile');
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(require("./routes/auth"));
app.use(require("./routes/demo"));
app.use(require("./routes/user/workspace"));
app.use(require("./routes/user/team"));
app.use(require("./routes/user/task"));

app.use('/uploads', express.static('uploads'));

app.use('/profile', profileRoute);

const server = http.createServer(app);

const { initSocket } = require("./configs/socket");
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on 3000");
});

console.log("app");

import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = {};
let finalChat = [];
io.on("connect", (socket) => {
  // socket.emit("welcome",)

  socket.on("joined", (user) => {
    users[user.id] = user;

    console.log("message-socket-id", user);

    socket.broadcast.emit("user-joined", {
      user: "admin",
      message: `${user.name} has joined`,
    });
  });

  socket.on("send-message", ({ text, user }) => {
    console.log("server-user", users);

    finalChat = [
      ...finalChat,
      {
        received_from: users[user.id],
        message: text,
        id: user.id,
      },
    ];
    socket.emit("message", finalChat);
  });
  setInterval(() => {
    socket.emit("all-message", finalChat);
  }, 1000);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

server.listen(PORT, () => {
  console.log(`successfully started:${PORT}`);
});

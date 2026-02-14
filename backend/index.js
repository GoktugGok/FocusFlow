import swaggerDocs from "./swagger.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRouter from "./src/routes/user.js";
import lofiRouter from "./src/routes/lofiRoutes.js";
import connectDB from "./src/routes/db.js";
import { on } from "events";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

const PORT = 3000;

app.use(express.json());
connectDB();
app.use(cors({ origin: "focus-flow-ruddy-two.vercel.app" }));
app.use("/api/users", userRouter);

// Bütün lofi routes’e io ekleyelim
app.use("/lofis", (req, res, next) => {
  req.io = io; 
  next();
}, lofiRouter);

app.get("/", (req, res) => res.send("Welcome"));

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("user-online", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online users:", Object.keys(onlineUsers)); 
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (userId) delete onlineUsers[userId];
    console.log("User disconnected:", socket.id);
    console.log("Online users now:", Object.keys(onlineUsers)); 
  });
});

swaggerDocs(app);
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));


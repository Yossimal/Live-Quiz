import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoute from "./routes/auth/routh";
import quizRoute from "./routes/quizzes/routh";
import { connectRedis } from "./routes/auth/tokens";
import mediaRoute from "./routes/media/routh";
import authenticate from "./middlewares/authenticate";
import { Server } from "socket.io";
import privateAuthRoute from "./routes/privateAuth/routh";
import http from "http";
import cors from "cors";
import {
  ServerToAdminClientEvents,
  ServerToUserClientEvents,
  AdminClientToServerEvents,
  UserClientToServerEvents,
} from "./gameOnline/events";
import mediaGetRoute from "./routes/mediaGet/routh";
import { SocketData } from "./gameOnline/types";
import gameOnlinHandler from "./gameOnline/gameOnlineHandler";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);

export const io = new Server<
  AdminClientToServerEvents & UserClientToServerEvents,
  ServerToAdminClientEvents & ServerToUserClientEvents,
  any,
  SocketData
>(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use("/auth", authRoute);
app.use("/api/quiz", authenticate, quizRoute);
app.use("/api/media", authenticate, mediaRoute);
app.use("/media", mediaGetRoute);
app.use("/api/auth", authenticate, privateAuthRoute);

io.on("connection", gameOnlinHandler);

const port = process.env.PORT || 3000;

connectRedis().then((_) => {
  server.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoute from "./routes/auth/routh";
import quizRoute from "./routes/quizzes/routh";
import { connectRedis } from "./routes/auth/tokens";
import authenticate from "./middlewares/authenticate";
import { Server } from 'socket.io'
import http from 'http'
import cors from "cors";
import {
  ServerToAdminClientEvents,
  ServerToUserClientEvents,
  AdminClientToServerEvents,
  UserClientToServerEvents,
} from './gameOnline/events';
import { SocketData } from './gameOnline/types'
import gameOnlinHandler from './gameOnline/gameOnlineHandler'

const app = express();
app.use(cors());
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
    methods: ['GET', 'POST']
  }
});


app.use("/auth", authRoute);
app.use("/api/quiz", authenticate, quizRoute);

io.on('connection', gameOnlinHandler);


const port = process.env.PORT || 3000;

connectRedis().then((_) => {

  server.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
});

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

const app = express();
app.use(cors());

const server = http.createServer(app)


app.use(express.json());
app.use("/auth", authRoute);
app.use("/api/quiz", authenticate, quizRoute);


const port = process.env.PORT || 3000;

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// listen to socekt connections
io.on('connection', (socket) => {
  console.log(`user connected: ${socket.id}`);

  // socket.on('open-game', id => {
  //   socket.emit('get-token-game', id * 8);
  // });

  socket.on('disconnect', (reason) => {
    console.log(`user disconnected: ${reason}, ${socket.id}`);
  });
});


connectRedis().then((_) => {

  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
});

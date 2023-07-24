import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoute from "./routes/auth/routh";
import quizRoute from "./routes/quizzes/routh";
import { connectRedis } from "./routes/auth/tokens";
import authenticate from "./middlewares/authenticate";
import { Server } from 'socket.io'
import http from 'http'


const app = express();

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

// listen to socekt connections
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId)
      .emit('user-connected', userId);

  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
});




app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);
app.use("/api/quiz", authenticate, quizRoute);


const port = process.env.PORT || 3000;

connectRedis().then((client) => {
  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
});

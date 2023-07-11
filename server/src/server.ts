import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoute from "./routes/auth/routh";
import { connectRedis } from "./routes/auth/tokens";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);

const port = process.env.PORT || 3000;

connectRedis().then((client) => {
  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
  });
});

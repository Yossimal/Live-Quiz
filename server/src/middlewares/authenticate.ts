import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";
// import jwt from 'jsonwebtoken'
import * as jwt from "../routes/auth/jwt-redis";

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
  //     if (err) return res.sendStatus(403)
  //     console.log('user', user);
  //     res.locals.user = user
  //     next()
  // })
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    console.log("user", user);
    res.locals.user = user;
    next();
  } catch (err) {
    if (err == "Invalid refresh token") {
      return res.sendStatus(403);
    } else {
      return res.sendStatus(500);
    }
  }
}

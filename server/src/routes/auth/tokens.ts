import { createClient } from "redis";
import { randomUUID } from "crypto";
import {
  sign,
  refreshAccessToken as refresh,
  destroyToken,
  connect,
} from "./jwt-redis";


const DEFAULT_EXPIRATION_TIME_REFRESH = 60 * 60 * 24 * 30;
const DEFAULT_EXPIRATION_TIME_ACCESS = 60 * 5;
const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export type TokenData = {
  id: number;
  email: string;
};

export async function connectRedis() {
  const client = await connect();
  client.on("error", (err) => console.log("Redis Client Error", err));

  client.on("connect", (msg) => console.log("Client connected to Redis..."));

  return client;
}

// export async function getToken(email: string) {
//   return (await client).get(email);
// }

// export async function addToken(email: string, token: string) {
//   (await client).setEx(email, DEFULT_EXPRETION_TIME, token);
// }

export async function deleteRefreshToken(token: string) {
  destroyToken(token, JWT_REFRESH_SECRET, DEFAULT_EXPIRATION_TIME_REFRESH);
}

export async function deleteAcessToken(token: string) {
  destroyToken(token, JWT_ACCESS_SECRET, DEFAULT_EXPIRATION_TIME_ACCESS);
}

export async function generateRefreshToken(
  tokenData: TokenData
): Promise<string> {
  const tokenPayload = { ...tokenData, jti: randomUUID() };
  const refreshToken = await sign(
    tokenData,
    JWT_REFRESH_SECRET,
    DEFAULT_EXPIRATION_TIME_REFRESH
  );
  return refreshToken;
}

export async function generateAccessToken(
  tokenData: TokenData
): Promise<string> {
  return await sign(
    tokenData,
    JWT_ACCESS_SECRET,
    DEFAULT_EXPIRATION_TIME_ACCESS
  );
}

// export async function verifyRefreshToken(
//   refreshToken: string
// ): Promise<TokenData> {
//   const tokenData = await jwtr.verify(refreshToken, JWT_REFRESH_SECRET);
//   return tokenData as TokenData;
// }

// export async function verifyAccessToken(
//   accessToken: string
// ): Promise<TokenData> {
//   const tokenData = await jwtr.verify(accessToken, JWT_ACCESS_SECRET);
//   return tokenData as TokenData;
// }

// export async function deleteRefreshToken(
//   refreshToken: string
// ): Promise<boolean> {
//   return destroyToken(
//     refreshToken,
//     JWT_REFRESH_SECRET,
//     DEFAULT_EXPIRATION_TIME_REFRESH
//   )
//     .then(() => true)
//     .catch(() => false);
// }

export async function refreshAccessToken(
  refreshToken: string
): Promise<string> {
  return refresh(
    refreshToken,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_SECRET,
    DEFAULT_EXPIRATION_TIME_ACCESS
  );
}

// export async function deleteAccessToken(accessToken: string): Promise<boolean> {
//   const tokenData = await jwtr.verify(accessToken, JWT_ACCESS_SECRET);
//   const { jti } = tokenData as TokenData & { jti: string };
//   return jwtr.destroy(accessToken);
// }

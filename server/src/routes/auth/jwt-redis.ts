import { createClient } from "redis";
import {
  JwtPayload,
  SignOptions,
  sign as jwtSign,
  verify as jwtVerfy,
} from "jsonwebtoken";
import { randomUUID } from "crypto";

export type RedisClient = ReturnType<typeof createClient>;

let _client: RedisClient | null = null;

const BLACK_LIST_PREFIX = "jwt:blacklist:";

export async function connect(): Promise<RedisClient> {
  if (_client) {
    return _client;
  }
  const client = createClient();
  await client.connect();
  _client = client;
  return client;
}

export async function sign(
  payload: any,
  secret: string,
  expirationTime: number
): Promise<string> {
  const jti = randomUUID();
  const tokenPayload = { ...payload, jti };
  const token = jwtSign(tokenPayload, secret, {
    expiresIn: expirationTime,
  });
  return token;
}

export async function verify(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  if (!_client) {
    throw new Error("Redis client not connected");
  }
  const refreshTokenData = jwtVerfy(token, secret);
  if (!refreshTokenData || typeof refreshTokenData === "string") {
    return null;
  }
  if (!("jti" in (refreshTokenData as object))) {
    throw new Error("Invalid refresh token");
  }
  const payload = refreshTokenData as JwtPayload;
  const jti = payload.jti;
  const isExists = await _client.exists(`${BLACK_LIST_PREFIX}${jti}`);
  if (isExists) {
    return null;
  }
  return refreshTokenData;
}

export function refreshAccessToken(
  refreshToken: string,
  refreshSecret: string,
  accessSecret: string,
  accessTimeout: number
) {
  const tokenData = verify(refreshToken, refreshSecret);
  const tokenParams: any = {
    ...tokenData,
  };
  if (tokenParams.jti !== undefined) {
    delete tokenParams.jti;
  }
  if (tokenParams.exp !== undefined) {
    delete tokenParams.exp;
  }
  if (tokenParams.iat !== undefined) {
    delete tokenParams.iat;
  }
  const accessToken = sign(tokenParams, accessSecret, accessTimeout);
  return accessToken;
}

export async function destroyToken(
  refreshToken: string,
  refreshSecret: string,
  refreshExpirationTime: number
) {
  if (!_client) {
    throw new Error("Redis client not connected");
  }
  const refreshTokenData = await verify(refreshToken, refreshSecret);
  if (!refreshTokenData) {
    throw new Error("Invalid refresh token");
  }
  const jti = (refreshTokenData as { jti: string }).jti;

  await _client.setEx(`${BLACK_LIST_PREFIX}${jti}`, refreshExpirationTime, "1");
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateAccessToken = exports.generateRefreshToken = exports.deleteAcessToken = exports.deleteRefreshToken = exports.connectRedis = void 0;
const crypto_1 = require("crypto");
const jwt_redis_1 = require("./jwt-redis");
const DEFAULT_EXPIRATION_TIME_REFRESH = 60 * 60 * 24 * 30;
const DEFAULT_EXPIRATION_TIME_ACCESS = 60 * 60 * 5; // TODO change to 5 min
const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
async function connectRedis() {
    const client = await (0, jwt_redis_1.connect)();
    client.on("error", (err) => console.log("Redis Client Error", err));
    client.on("connect", (msg) => console.log("Client connected to Redis..."));
    return client;
}
exports.connectRedis = connectRedis;
// export async function getToken(email: string) {
//   return (await client).get(email);
// }
// export async function addToken(email: string, token: string) {
//   (await client).setEx(email, DEFULT_EXPRETION_TIME, token);
// }
async function deleteRefreshToken(token) {
    (0, jwt_redis_1.destroyToken)(token, JWT_REFRESH_SECRET, DEFAULT_EXPIRATION_TIME_REFRESH);
}
exports.deleteRefreshToken = deleteRefreshToken;
async function deleteAcessToken(token) {
    (0, jwt_redis_1.destroyToken)(token, JWT_ACCESS_SECRET, DEFAULT_EXPIRATION_TIME_ACCESS);
}
exports.deleteAcessToken = deleteAcessToken;
async function generateRefreshToken(tokenData) {
    const tokenPayload = Object.assign(Object.assign({}, tokenData), { jti: (0, crypto_1.randomUUID)() });
    const refreshToken = await (0, jwt_redis_1.sign)(tokenData, JWT_REFRESH_SECRET, DEFAULT_EXPIRATION_TIME_REFRESH);
    return refreshToken;
}
exports.generateRefreshToken = generateRefreshToken;
async function generateAccessToken(tokenData) {
    return await (0, jwt_redis_1.sign)(tokenData, JWT_ACCESS_SECRET, DEFAULT_EXPIRATION_TIME_ACCESS);
}
exports.generateAccessToken = generateAccessToken;
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
async function refreshAccessToken(refreshToken) {
    return (0, jwt_redis_1.refreshAccessToken)(refreshToken, JWT_REFRESH_SECRET, JWT_ACCESS_SECRET, DEFAULT_EXPIRATION_TIME_ACCESS);
}
exports.refreshAccessToken = refreshAccessToken;
// export async function deleteAccessToken(accessToken: string): Promise<boolean> {
//   const tokenData = await jwtr.verify(accessToken, JWT_ACCESS_SECRET);
//   const { jti } = tokenData as TokenData & { jti: string };
//   return jwtr.destroy(accessToken);
// }
//# sourceMappingURL=tokens.js.map
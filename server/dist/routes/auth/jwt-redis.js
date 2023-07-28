"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyToken = exports.refreshAccessToken = exports.verify = exports.sign = exports.connect = void 0;
const redis_1 = require("redis");
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = require("crypto");
let _client = null;
const BLACK_LIST_PREFIX = "jwt:blacklist:";
async function connect() {
    if (_client) {
        return _client;
    }
    const client = (0, redis_1.createClient)();
    await client.connect();
    _client = client;
    return client;
}
exports.connect = connect;
async function sign(payload, secret, expirationTime) {
    const jti = (0, crypto_1.randomUUID)();
    const tokenPayload = Object.assign(Object.assign({}, payload), { jti });
    const token = (0, jsonwebtoken_1.sign)(tokenPayload, secret, {
        expiresIn: expirationTime,
    });
    return token;
}
exports.sign = sign;
async function verify(token, secret) {
    if (!_client) {
        throw new Error("Redis client not connected");
    }
    const refreshTokenData = (0, jsonwebtoken_1.verify)(token, secret);
    if (!refreshTokenData || typeof refreshTokenData === "string") {
        return null;
    }
    if (!("jti" in refreshTokenData)) {
        throw new Error("Invalid refresh token");
    }
    const payload = refreshTokenData;
    const jti = payload.jti;
    const isExists = await _client.exists(`${BLACK_LIST_PREFIX}${jti}`);
    if (isExists) {
        return null;
    }
    return refreshTokenData;
}
exports.verify = verify;
function refreshAccessToken(refreshToken, refreshSecret, accessSecret, accessTimeout) {
    const tokenData = verify(refreshToken, refreshSecret);
    const tokenParams = Object.assign({}, tokenData);
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
exports.refreshAccessToken = refreshAccessToken;
async function destroyToken(refreshToken, refreshSecret, refreshExpirationTime) {
    if (!_client) {
        throw new Error("Redis client not connected");
    }
    const refreshTokenData = await verify(refreshToken, refreshSecret);
    if (!refreshTokenData) {
        throw new Error("Invalid refresh token");
    }
    const jti = refreshTokenData.jti;
    await _client.setEx(`${BLACK_LIST_PREFIX}${jti}`, refreshExpirationTime, "1");
}
exports.destroyToken = destroyToken;
//# sourceMappingURL=jwt-redis.js.map
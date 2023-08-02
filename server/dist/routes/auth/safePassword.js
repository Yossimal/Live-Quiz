"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hasePassword = void 0;
const crypto_1 = require("crypto");
function hasePassword(password) {
    const salt = (0, crypto_1.randomBytes)(8).toString('hex');
    const hash = (0, crypto_1.scryptSync)(password, salt, 32);
    return `${salt}:${hash.toString('hex')}`;
}
exports.hasePassword = hasePassword;
function verifyPassword(password, hash) {
    const [salt, key] = hash.split(':');
    const buffer = (0, crypto_1.scryptSync)(password, salt, 32);
    return buffer.toString('hex') === key;
}
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=safePassword.js.map
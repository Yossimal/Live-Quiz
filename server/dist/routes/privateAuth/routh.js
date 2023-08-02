"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const v = __importStar(require("./validation"));
const safePassword_1 = require("../auth/safePassword");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/changePassword", v.changePasswordValidation, async (req, res) => {
    try {
        const { oldPassword, newPassword } = res.locals.changePasswordData;
        const user = await prisma.user.findUnique({
            where: {
                id: res.locals.user.id,
            },
        });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        console.log(oldPassword, (0, safePassword_1.hasePassword)(oldPassword), user.password, (0, safePassword_1.hasePassword)(newPassword) == user.password);
        if (!(0, safePassword_1.verifyPassword)(oldPassword, user.password)) {
            return res.status(400).send({ error: "Old password not match" });
        }
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: (0, safePassword_1.hasePassword)(newPassword),
            },
        });
        res.status(200).send({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
});
router.post("/updateProfile", v.updateUserDataValidation, async (req, res) => {
    try {
        const { firstName, lastName, email } = res.locals.updateUserData;
        const user = await prisma.user.update({
            where: {
                id: res.locals.user.id,
            },
            data: {
                firstName,
                lastName,
                email,
            },
        });
        res.status(200).send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
});
exports.default = router;
//# sourceMappingURL=routh.js.map
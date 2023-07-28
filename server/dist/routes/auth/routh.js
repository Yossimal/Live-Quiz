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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const safePassword_1 = require("./safePassword");
const v = __importStar(require("./validation"));
const tokens_1 = require("./tokens");
const sendEmail_1 = __importDefault(require("../../lib/email/sendEmail"));
const varification_1 = __importDefault(require("../../templates/emails/varification/varification"));
const resetPassword_1 = __importDefault(require("../../templates/emails/resetPassword/resetPassword"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
function getTokenData({ id, email, }) {
    return { id, email };
}
async function sendVarificationEmail(user) {
    console.log("sendVarificationEmail");
    const varificationToken = await prisma.emailValidationTokens.create({
        data: {
            userId: user.id,
        },
        select: {
            token: true,
        },
    });
    const emailData = await (0, varification_1.default)(`${user.firstName} ${user.lastName}`, varificationToken.token);
    (0, sendEmail_1.default)(user.email, emailData);
}
router.post("/login", v.loginValidation, async (req, res) => {
    const { email, password } = res.locals.loginValues;
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });
    if (!user || !(0, safePassword_1.verifyPassword)(password, user.password)) {
        return res.status(403).send({ error: "Invalid email or password" });
    }
    if (!user.varified) {
        await sendVarificationEmail(user);
        return res.status(403).send({ error: "Email not varified" });
    }
    const accessToken = await (0, tokens_1.generateAccessToken)(user);
    const refreshToken = await (0, tokens_1.generateRefreshToken)(user);
    res.send({ user, accessToken, refreshToken });
});
router.post("/token", v.tokenValidation, async (req, res) => {
    const auth = res.locals.auth;
    const refreshToken = auth.token;
    const accessToken = await (0, tokens_1.refreshAccessToken)(refreshToken);
    if (!accessToken)
        return res.status(403).send({ error: "Invalid token" });
    res.send({ accessToken });
});
router.post("/logout", v.logoutValidation, (req, res) => {
    const tokens = res.locals.tokens;
    (0, tokens_1.deleteAcessToken)(tokens.accessToken);
    (0, tokens_1.deleteRefreshToken)(tokens.refreshToken);
    res.sendStatus(204);
});
router.post("/signup", v.singupValidation, async (req, res) => {
    const { firstName, lastName, email, password, birthday } = res.locals
        .singupValues;
    const hase = (0, safePassword_1.hasePassword)(password);
    try {
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                birthday,
                password: hase,
            },
        });
        sendVarificationEmail(user);
        res.send(user);
    }
    catch (err) {
        const prismaError = err;
        if ((prismaError === null || prismaError === void 0 ? void 0 : prismaError.code) === "P2002") {
            res.status(400).send({ error: "Email already exists" });
        }
        else {
            res.status(500).send({ error: "Something went wrong" });
        }
    }
});
router.post("/varifyEmail", v.emailVarificationValidation, async (req, res) => {
    const token = res.locals.token;
    try {
        const tokenData = await prisma.emailValidationTokens.findFirst({
            where: {
                token,
            },
        });
        if (!tokenData) {
            return res.status(404).send({ error: "Token not found" });
        }
        //if the token is expired -> send new token
        if (tokenData.expiresAt < new Date()) {
            const user = await prisma.user.findUnique({
                where: {
                    id: tokenData.userId,
                },
            });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            sendVarificationEmail(user);
            return res.status(400).send({ error: "Token expired" });
        }
        //if the token is valid -> update user
        const user = await prisma.user.update({
            where: {
                id: tokenData.userId,
            },
            data: {
                varified: true,
            },
            select: {
                varified: true,
            },
        });
        console.log(user);
        return res.status(200).send({ ok: true });
    }
    catch (err) {
        const prismaError = err;
        if ((prismaError === null || prismaError === void 0 ? void 0 : prismaError.code) === "P2002") {
            return res.status(400).send({ error: "Email already exists" });
        }
        else {
            return res.status(500).send({ error: "Something went wrong" });
        }
    }
});
router.post("/forgotPassword", v.forgotPasswordValidation, async (req, res) => {
    try {
        const email = res.locals.email;
        //check if the email exists
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).send({ error: "Email not exists." });
        }
        //create token
        const token = await prisma.passwordResetTokens.create({
            data: {
                userId: user.id,
            },
            select: {
                token: true,
            },
        });
        //send email
        const template = await (0, resetPassword_1.default)(`${user.firstName} ${user.lastName}`, token.token);
        (0, sendEmail_1.default)(user.email, template);
        res.status(200).send({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
});
router.post("/resetPassword", v.resetPasswordValidation, async (req, res) => {
    try {
        const { token, password } = res.locals;
        //check if the token exists
        const tokenData = await prisma.passwordResetTokens.findFirst({
            where: {
                token,
            },
        });
        if (!tokenData) {
            return res
                .status(404)
                .send({ error: "Password request not found", fetal: true });
        }
        //if the token is expired -> send proper error
        if (tokenData.expiresAt < new Date()) {
            return res.status(400).send({
                error: "Reset password request expired. please ask again for new link.",
                fetal: true,
            });
        }
        //if the token is valid -> update user
        const user = await prisma.user.update({
            where: {
                id: tokenData.userId,
            },
            data: {
                password: (0, safePassword_1.hasePassword)(password),
            },
        });
        //send success message
        res.status(200).send({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
});
exports.default = router;
//# sourceMappingURL=routh.js.map
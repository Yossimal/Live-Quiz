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
exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.emailVarificationValidation = exports.logoutValidation = exports.tokenValidation = exports.loginValidation = exports.singupValidation = exports.PASSWORD_REGEX = void 0;
const zod_1 = __importStar(require("zod"));
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const singupSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3),
    lastName: zod_1.default.string().min(3),
    email: zod_1.default.string().email(),
    birthday: zod_1.default.coerce.date(),
    password: zod_1.default.string().regex(exports.PASSWORD_REGEX),
});
function singupValidation(req, res, next) {
    try {
        const singupValues = singupSchema.parse(req.body);
        res.locals.singupValues = singupValues;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.singupValidation = singupValidation;
const LoginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
});
function loginValidation(req, res, next) {
    try {
        const loginValues = LoginSchema.parse(req.body);
        res.locals.loginValues = loginValues;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.loginValidation = loginValidation;
const tokenSchema = zod_1.default.object({
    token: zod_1.default.string(),
});
function tokenValidation(req, res, next) {
    try {
        const auth = tokenSchema.parse(req.body);
        res.locals.auth = auth;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        return res.status(400).send({ error: error.errors });
    }
}
exports.tokenValidation = tokenValidation;
const logoutSchema = zod_1.default.object({
    accessToken: zod_1.default.string(),
    refreshToken: zod_1.default.string(),
});
function logoutValidation(req, res, next) {
    try {
        const tokens = logoutSchema.parse(req.body);
        res.locals.tokens = tokens;
        next();
    }
    catch (error) {
        // //TODO :: send clear string to the end user with the error!!!!!!!!!!
        // if (error instanceof ZodError) {
        //   if (error.errors[0].path[0] === "accessToken") {
        //     return res.status(400).send({ error: "Invalid access token!" });
        //   }
        //   if (error.errors[0].path[0] === "refreshToken") {
        //     return res.status(400).send({ error: "Invalid refresh token!" });
        //   }
        // }
        // res.status(500).send({ error: "An unexpected error occured" });
        return res.status(400).send({ error: error.errors });
    }
}
exports.logoutValidation = logoutValidation;
function emailVarificationValidation(req, res, next) {
    try {
        const token = zod_1.default.string().parse(req.body.token);
        res.locals.token = token;
        next();
    }
    catch (error) {
        res.status(400).send({
            error: "There was an error in the token, try to login again to get new token.",
        });
    }
}
exports.emailVarificationValidation = emailVarificationValidation;
const forgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
function forgotPasswordValidation(req, res, next) {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);
        res.locals.email = email;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "The email address is not valid" });
    }
}
exports.forgotPasswordValidation = forgotPasswordValidation;
const resetPasswordSchema = zod_1.default.object({
    password: zod_1.default.string().regex(exports.PASSWORD_REGEX),
    token: zod_1.default.string(),
});
function resetPasswordValidation(req, res, next) {
    try {
        const { password, token } = resetPasswordSchema.parse(req.body);
        res.locals.password = password;
        res.locals.token = token;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            if (error.errors[0].path[0] === "password") {
                return res
                    .status(400)
                    .send({ error: "Invalid password!", fetal: false });
            }
            if (error.errors[0].path[0] === "token") {
                return res.status(400).send({
                    error: "The link you got is not valid. Please ask again for password reset.",
                    fetal: true,
                });
            }
        }
        res.status(500).send({ error: "An unexpected error occured" });
    }
}
exports.resetPasswordValidation = resetPasswordValidation;
//# sourceMappingURL=validation.js.map
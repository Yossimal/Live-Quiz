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
exports.updateUserDataValidation = exports.changePasswordValidation = void 0;
const validation_1 = require("../auth/validation");
const zod_1 = __importStar(require("zod"));
const changePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default.string().regex(validation_1.PASSWORD_REGEX),
    newPassword: zod_1.default.string().regex(validation_1.PASSWORD_REGEX),
});
function changePasswordValidation(req, res, next) {
    try {
        const data = changePasswordSchema.parse(req.body);
        res.locals.changePasswordData = data;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            if (error.errors[0].path[0] === "oldPassword") {
                return res.status(400).send({ error: "Invalid old password!" });
            }
            if (error.errors[0].path[0] === "newPassword") {
                return res.status(400).send({ error: "Invalid new password!" });
            }
        }
    }
}
exports.changePasswordValidation = changePasswordValidation;
const updateUserDataSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(3),
    lastName: zod_1.default.string().min(3),
    email: zod_1.default.string().email(),
});
function updateUserDataValidation(req, res, next) {
    try {
        const data = updateUserDataSchema.parse(req.body);
        res.locals.updateUserData = data;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            if (error.errors[0].path[0] === "firstName") {
                return res.status(400).send({ error: "Invalid first name!" });
            }
            if (error.errors[0].path[0] === "lastName") {
                return res.status(400).send({ error: "Invalid last name!" });
            }
            if (error.errors[0].path[0] === "email") {
                return res.status(400).send({ error: "Invalid email!" });
            }
        }
        res.status(500).send({ error: "An unexpected error occured" });
    }
}
exports.updateUserDataValidation = updateUserDataValidation;
//# sourceMappingURL=validation.js.map
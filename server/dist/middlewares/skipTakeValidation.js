"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const skipTakeSchema = zod_1.default.object({
    skip: zod_1.default.number().int().default(0),
    take: zod_1.default.number().int().positive().default(10)
});
//export const SkipTakeType = z.infer<typeof skipTakeSchema>;
function skipTakeValidation(req, res, next) {
    try {
        const { skip, take } = skipTakeSchema.parse(req.query);
        res.locals.skipTake = { skip, take };
        next();
    }
    catch (err) {
        res.sendStatus(400);
    }
}
exports.default = skipTakeValidation;
//# sourceMappingURL=skipTakeValidation.js.map
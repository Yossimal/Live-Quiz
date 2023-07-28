"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const multer_1 = require("../../middlewares/multer");
const types_1 = require("../../gameOnline/types");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/quiz/:id", (0, multer_1.getMulter)("images/quiz").single("image"), async (req, res) => {
    const quizId = parseInt(req.params.id);
    const image = req.file;
    const user = res.locals.user;
    console.log("image", image);
    if (!image)
        return res.status(400).send({ error: "No image" });
    const media = await prisma.media.create({
        data: {
            quizId,
            type: types_1.MediaType.IMAGE,
            path: image.path,
            ownerId: user.id,
        },
        select: {
            id: true,
        },
    });
    if (!(media === null || media === void 0 ? void 0 : media.id)) {
        return res.status(500).send({ error: "Something went wrong" });
    }
    const results = await prisma.quiz.update({
        where: {
            id: quizId,
        },
        data: {
            imageId: media.id,
        },
        select: {
            imageId: true,
            id: true,
        },
    });
    res.send({ ok: true });
});
exports.default = router;
//# sourceMappingURL=routh.js.map
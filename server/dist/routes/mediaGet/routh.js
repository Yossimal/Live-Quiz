"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const media = await prisma.media.findFirst({
            where: {
                id,
            },
            select: {
                path: true,
            },
        });
        if (!media)
            return res.status(404).send({ error: "Media not found" });
        console.log(`\\${media.path}`);
        res.sendFile(`\\${media.path}`, { root: "./" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Something went wrong" });
    }
});
exports.default = router;
//# sourceMappingURL=routh.js.map
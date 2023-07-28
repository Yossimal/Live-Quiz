"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const skipTakeValidation_1 = __importDefault(require("../../middlewares/skipTakeValidation"));
const validation_1 = require("./validation");
const updateFunctions_1 = require("./updateFunctions");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/", skipTakeValidation_1.default, async (req, res) => {
    const user = res.locals.user;
    const { skip, take } = res.locals.skipTake;
    if (!user)
        return res.sendStatus(401);
    console.log("user", user);
    const games = await prisma.quiz.findMany({
        where: {
            creatorId: user.id,
            isDeleted: false,
        },
        skip,
        take,
        include: {
            _count: {
                select: {
                    questions: { where: { isDeleted: false } },
                    onlineQuizzes: true,
                },
            },
        },
    });
    res.send(games);
});
router.get("/archived", skipTakeValidation_1.default, async (req, res) => {
    const user = res.locals.user;
    const { skip, take } = res.locals.skipTake;
    if (!user)
        return res.sendStatus(401);
    const games = await prisma.quiz.findMany({
        where: {
            creatorId: user.id,
            isDeleted: true,
        },
        skip,
        take,
    });
    res.send(games);
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.sendStatus(400);
    const quiz = await prisma.quiz.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            questions: {
                where: {
                    isDeleted: false,
                },
                include: {
                    options: {
                        where: {
                            isDeleted: false,
                        },
                    },
                },
            },
        },
    });
    if (!quiz)
        return res.sendStatus(404);
    res.send(quiz);
});
router.post("/", validation_1.postValidation, async (req, res) => {
    const user = res.locals.user;
    if (!user)
        return res.sendStatus(401);
    const quiz = res.locals.newQuiz;
    try {
        const newQuiz = await prisma.quiz.create({
            data: {
                description: quiz.description,
                name: quiz.name,
                creatorId: user.id,
                //imageId: quiz.image,
            },
            select: {
                id: true,
            },
        });
        res.status(201).send(newQuiz);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
router.delete("/:id", async (req, res) => {
    const user = res.locals.user;
    if (!user)
        return res.sendStatus(401);
    const id = Number(req.params.id);
    if (!id)
        return res.sendStatus(400);
    await prisma.quiz.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    res.sendStatus(204);
});
router.post("/update", validation_1.updateQuizValidation, async (req, res) => {
    var _a;
    const quiz = res.locals.updatedQuiz;
    const [questionsToUpdate, questionsToAdd, questionsToDelete] = (0, updateFunctions_1.splitQuestionsToUpdatAddAndDelete)((_a = quiz.questions) !== null && _a !== void 0 ? _a : []);
    const optionsToAdd = (0, updateFunctions_1.getOptionsToAdd)([
        ...questionsToAdd,
        ...questionsToUpdate,
    ]);
    try {
        await Promise.all([
            (0, updateFunctions_1.updateBaseQuiz)(quiz),
            (0, updateFunctions_1.updateQuestions)(questionsToUpdate),
            (0, updateFunctions_1.updateOptions)(questionsToUpdate),
            (0, updateFunctions_1.addOptions)(optionsToAdd),
            (0, updateFunctions_1.addQuestions)(questionsToAdd, quiz.id),
            (0, updateFunctions_1.deleteQuestions)(questionsToDelete),
        ]);
        const updatedQuiz = await prisma.quiz.findUnique({
            where: {
                id: quiz.id,
            },
            include: {
                questions: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        options: {
                            where: {
                                isDeleted: false,
                            },
                        },
                    },
                },
            },
        });
        console.log("updatedQuiz", updatedQuiz);
        res.send(updatedQuiz);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
router.delete("/deleteQuestion/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.sendStatus(400);
    await prisma.question.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    res.sendStatus(204);
});
exports.default = router;
//# sourceMappingURL=routh.js.map
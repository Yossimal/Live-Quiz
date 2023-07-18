import express from "express";
import { PrismaClient } from "@prisma/client";
import skipTakeValidation from "../../middlewares/skipTakeValidation";
import {
    QuizType,
    QuizPutType,
    QuestionType,
    QuestionPutType,
    postValidation,
    putValidation,
    addQuestionValidation,
    updateQuestionValidation
} from "./validation";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";


const prisma = new PrismaClient();

const router = express.Router();

router.get("/", skipTakeValidation, async (req, res) => {
    const user = res.locals.user;
    const { skip, take } = res.locals.skipTake;
    if (!user) return res.sendStatus(401);

    const games = await prisma.quiz.findMany({
        where: {
            creatorId: user.id,
            isDeleted: false
        },
        skip,
        take,
        include: {
            _count: {
                select: {
                    questions: true,
                    onlineQuizzes: true
                }
            }
        }
    });
    res.send(games);
});


router.get("/archived", skipTakeValidation, async (req, res) => {
    const user = res.locals.user;
    const { skip, take } = res.locals.skipTake;
    if (!user) return res.sendStatus(401);

    const games = await prisma.quiz.findMany({
        where: {
            creatorId: user.id,
            isDeleted: true
        },
        skip,
        take
    });
    res.send(games);
});


router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.sendStatus(400);

    const quiz = await prisma.quiz.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            questions: {
                where: {
                    isDeleted: false
                },
                include: {
                    options: true
                }
            }
        }
    });
    if (!quiz) return res.sendStatus(404);


    res.send(quiz);
});


router.post("/", postValidation, async (req, res) => {
    const user = res.locals.user;
    if (!user) return res.sendStatus(401);

    const quiz = res.locals.newQuiz as QuizType;
    try {
        const newQuiz = await prisma.quiz.create({
            data: {
                ...quiz,
                creatorId: user.id
            }
        });
        res.status(201).send(newQuiz);
    } catch (err: PrismaClientValidationError | unknown) {
        res.sendStatus(500);
    }
});


router.put("/", putValidation, async (req, res) => {
    const user = res.locals.user;
    if (!user) return res.sendStatus(401);

    const quiz = res.locals.updatedQuiz as QuizPutType;

    const updatedQuiz = await prisma.quiz.update({
        where: {
            id: quiz.id
        },
        data: {
            ...quiz
        }
    });
    res.send(updatedQuiz);
});


router.delete("/:id", async (req, res) => {
    const user = res.locals.user;
    if (!user) return res.sendStatus(401);

    const id = Number(req.params.id);
    if (!id) return res.sendStatus(400);

    await prisma.quiz.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });
    res.sendStatus(204);
});


router.post('/addQuestion', addQuestionValidation, async (req, res) => {
    const { quizId, question, media, mediaType, options } =
        res.locals.newQuestion as QuestionType;
    const newQuestion = await prisma.question.create({
        data: {
            quizId, question, media, mediaType, options: {
                createMany: {
                    data: options
                }
            }
        },
        include: {
            options: true
        }
    });
    res.status(201).send(newQuestion);
});


type OptionPut = {
    id?: number;
    data?: string;
    isCorrect?: boolean;
} | undefined;

function getOptions(options: OptionPut[] | undefined) {
    if (!options) return { newOptions: [], updatedOptions: [], deletedOptions: [] };
    const newOptions =
        options.filter(opt => opt?.id === undefined)
            .map(opt => ({
                data: opt!.data!,
                isCorrect: opt!.isCorrect!
            }));
    const updatedOptions =
        options.filter(opt => opt?.id !== undefined
            && (opt?.data !== undefined || opt?.isCorrect !== undefined))
            .map(opt => ({
                data: opt!.data,
                isCorrect: opt!.isCorrect,
                id: opt!.id!
            }));
    const deletedOptions =
        options.filter(opt => opt?.id !== undefined
            && opt?.data === undefined && opt?.isCorrect === undefined)
            .map(opt => opt!.id!);
    return { newOptions, updatedOptions, deletedOptions };
}


router.put('/updateQuestion', updateQuestionValidation, async (req, res) => {
    const { id, media, question, mediaType, options } =
        res.locals.updatedQuestion as QuestionPutType;

    const { newOptions, updatedOptions, deletedOptions } = getOptions(options);
    try {
        const updatedQuestion = await prisma.question.update(
            {
                where: {
                    id
                },
                data: {
                    media, question, mediaType,
                    options: {
                        createMany: {
                            data: newOptions
                        },
                        updateMany: updatedOptions.map(opt => ({
                            where: { id: opt.id },
                            data: {
                                data: opt.data,
                                isCorrect: opt.isCorrect,
                            },
                        })),
                        deleteMany: {
                            id: {
                                in: deletedOptions
                            }
                        }
                    }
                },
                include: {
                    options: true
                }
            }
        );
        res.send(updatedQuestion);
    } catch (err) {
        res.sendStatus(500);
    }
});


router.delete('/deleteQuestion/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.sendStatus(400);

    await prisma.question.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });
    res.sendStatus(204);
});


export default router;

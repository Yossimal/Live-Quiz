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
import { addOptions, updatedOptions } from "./optionalOptions";


const prisma = new PrismaClient();

const router = express.Router();

router.get("/", skipTakeValidation, async (req, res) => {
    const user = res.locals.user;
    const { skip, take } = res.locals.skipTake;
    if (!user) return res.sendStatus(401);

    const games = await prisma.quiz.findMany({
        where: {
            creatorId: user.id
        },
        skip,
        take
    });
    res.send(games);
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
    } catch (err) {
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
    const { quizId, question, media, mediaType, options } = res.locals.newQuestion as QuestionType;
    const newQuestion = await prisma.question.create({
        data: {
            quizId, question, media, mediaType
        }
    });
    const newOptions = addOptions(newQuestion.id, options);
    res.status(201).send({ ...newQuestion, newOptions });
});

router.put('/updateQuestion', updateQuestionValidation, async (req, res) => {
    const { id, media, question, mediaType, options } = res.locals.updatedQuestion as QuestionPutType;
    const updatedQuestion = await prisma.question.update({
        where: {
            id: id
        },
        data: {
            media, question, mediaType
        }
    });
    const updetedOption = updatedOptions(options);
    res.send({ ...updatedQuestion, updetedOption });
});



export default router;

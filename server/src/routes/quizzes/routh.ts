import express from "express";
import { PrismaClient } from "@prisma/client";
import skipTakeValidation from "../../middlewares/skipTakeValidation";
import {
  QuizType,
  postValidation,
  updateQuizValidation,
  UpdateQuizType,
} from "./validation";
import { addOptions, addQuestions, deleteQuestions, getOptionsToAdd, splitQuestionsToUpdatAddAndDelete, updateBaseQuiz, updateOptions, updateQuestions } from "./updateFunctions";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", skipTakeValidation, async (req, res) => {
  const user = res.locals.user;
  const { skip, take } = res.locals.skipTake;
  if (!user) return res.sendStatus(401);
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
          questions: {where: {isDeleted: false}},
          onlineQuizzes: true,
        },
      },
    },
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
      isDeleted: true,
    },
    skip,
    take,
  });
  res.send(games);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.sendStatus(400);

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
          options: true,
        },
      },
    },
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
  } catch (err: PrismaClientValidationError | unknown) {
    res.sendStatus(500);
  }
});

router.delete("/:id", async (req, res) => {
  const user = res.locals.user;
  if (!user) return res.sendStatus(401);

  const id = Number(req.params.id);
  if (!id) return res.sendStatus(400);

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

router.post("/update", updateQuizValidation, async (req, res) => {
  const quiz = res.locals.updatedQuiz as UpdateQuizType;
  const [questionsToUpdate, questionsToAdd, questionsToDelete] =
    splitQuestionsToUpdatAddAndDelete(quiz.questions ?? []);
  const optionsToAdd = getOptionsToAdd([...questionsToAdd,...questionsToUpdate]);
  try {
    await Promise.all([
      updateBaseQuiz(quiz),
      updateQuestions(questionsToUpdate),
      updateOptions(questionsToUpdate),
      addOptions(optionsToAdd),
      addQuestions(questionsToAdd, quiz.id),
      deleteQuestions(questionsToDelete),
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
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.delete("/deleteQuestion/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.sendStatus(400);

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

export default router;

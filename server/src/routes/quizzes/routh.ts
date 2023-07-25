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
  updateQuestionValidation,
  updateQuizValidation,
  UpdateQuizType,
  UpdateQuizQuestionType,
  UpdateQuizQuestionOptionType,
} from "./validation";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { removeUndefined } from "../../lib/tools/objects";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", skipTakeValidation, async (req, res) => {
  const user = res.locals.user;
  const { skip, take } = res.locals.skipTake;
  if (!user) return res.sendStatus(401);

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
          questions: true,
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

// router.put("/", putValidation, async (req, res) => {
//     const user = res.locals.user;
//     if (!user) return res.sendStatus(401);

//     const quiz = res.locals.updatedQuiz as QuizPutType;

//     const updatedQuiz = await prisma.quiz.update({
//         where: {
//             id: quiz.id
//         },
//         data: {
//             ...quiz
//         }
//     });
//     res.send(updatedQuiz);
// });

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

// router.post("/addQuestion", addQuestionValidation, async (req, res) => {
//   const { quizId, question, mediaType, options } = res.locals
//     .newQuestion as QuestionType;
//   const newQuestion = await prisma.question.create({
//     data: {
//       quizId,
//       question,
//       mediaType,
//       options: {
//         createMany: {
//           data: options,
//         },
//       },
//     },
//     include: {
//       options: true,
//     },
//   });
//   res.status(201).send(newQuestion);
// });

type OptionPut =
  | {
      id?: number;
      data?: string;
      isCorrect?: boolean;
    }
  | undefined;

function getOptions(options: OptionPut[] | undefined) {
  if (!options)
    return { newOptions: [], updatedOptions: [], deletedOptions: [] };
  const newOptions = options
    .filter((opt) => opt?.id === undefined)
    .map((opt) => ({
      data: opt!.data!,
      isCorrect: opt!.isCorrect!,
    }));
  const updatedOptions = options
    .filter(
      (opt) =>
        opt?.id !== undefined &&
        (opt?.data !== undefined || opt?.isCorrect !== undefined)
    )
    .map((opt) => ({
      data: opt!.data,
      isCorrect: opt!.isCorrect,
      id: opt!.id!,
    }));
  const deletedOptions = options
    .filter(
      (opt) =>
        opt?.id !== undefined &&
        opt?.data === undefined &&
        opt?.isCorrect === undefined
    )
    .map((opt) => opt!.id!);
  return { newOptions, updatedOptions, deletedOptions };
}

router.put("/updateQuestion", updateQuestionValidation, async (req, res) => {
  const { id, media, question, mediaType, options } = res.locals
    .updatedQuestion as QuestionPutType;

  const { newOptions, updatedOptions, deletedOptions } = getOptions(options);
  try {
    const updatedQuestion = await prisma.question.update({
      where: {
        id,
      },
      data: {
        question,
        mediaType,
        options: {
          createMany: {
            data: newOptions,
          },
          updateMany: updatedOptions.map((opt) => ({
            where: { id: opt.id },
            data: {
              data: opt.data,
              isCorrect: opt.isCorrect,
            },
          })),
          deleteMany: {
            id: {
              in: deletedOptions,
            },
          },
        },
      },
      include: {
        options: true,
      },
    });
    res.send(updatedQuestion);
  } catch (err) {
    res.sendStatus(500);
  }
});

function splitQuestionsToUpdatAddAndDelete(
  questions: UpdateQuizQuestionType[]
): [
  UpdateQuizQuestionOptionType[],
  UpdateQuizQuestionOptionType[],
  UpdateQuizQuestionOptionType[]
] {
  const questionsToUpdate = questions.filter(
    (q) => q.id !== undefined && !q.isDeleted
  );
  const questionsToAdd = questions.filter((q) => q.id === undefined);
  const questionsToDelete = questions.filter(
    (q) => q.id !== undefined && q.isDeleted
  );
  console.log("splitted", [
    questionsToUpdate,
    questionsToDelete,
    questionsToAdd,
  ]);
  return [questionsToUpdate, questionsToAdd, questionsToDelete];
}

type OptionToAdd = UpdateQuizQuestionOptionType & { quesitionId: number };

function getOptionsToAdd(questions: UpdateQuizQuestionType[]): OptionToAdd[] {
  console.log("getOptionsToAdd", questions);
  return (
    questions
      .map((q) => q.options?.map((o) => ({ ...o, quesitionId: q.id })))
      .flat()
      .filter((o): o is OptionToAdd => {
        console.log(
          o,
          o?.quesitionId !== undefined && o?.id === undefined,
          o?.quesitionId,
          o?.id
        );
        return (
          o != undefined && o.quesitionId !== undefined && o.id === undefined
        );
      }) ?? []
  );
}

function getOptionsToUpdate(
  questionsToUpdate: UpdateQuizQuestionType[]
): UpdateQuizQuestionOptionType[] {
  return (
    questionsToUpdate
      ?.map((q) => q.options)
      .flat()
      .filter((o): o is UpdateQuizQuestionOptionType => o?.id != undefined) ??
    []
  );
}

async function updateBaseQuiz(quiz: UpdateQuizType): Promise<void> {
  const updateQuizQuery = removeUndefined({
    name: quiz.name,
    description: quiz.description,
    imageId: quiz.image,
  });

  await prisma.quiz.update({
    where: {
      id: quiz.id,
    },
    data: updateQuizQuery,
  });
}

async function updateQuestions(
  questionsToUpdate: UpdateQuizQuestionType[]
): Promise<void> {
  //use forEach inseted of for of because we want to run all the queries in parallel
  await Promise.all(
    questionsToUpdate?.map(async (q) => {
      if (!q.id) return;
      const updateQuestionQuery = removeUndefined({
        question: q.question,
        mediaId: q.media,
        isDeleted: q.isDeleted ?? false,
        index: q.index,
        score: q.score,
        time: q.time,
      });
      await prisma.question.update({
        where: {
          id: q.id,
        },
        data: updateQuestionQuery,
      });
    })
  );
}

async function updateOptions(
  questionsToUpdate: UpdateQuizQuestionType[]
): Promise<void> {
  const optionsToUpdate = questionsToUpdate
    ?.map((q) => q.options)
    .flat()
    .filter((o) => o?.id !== undefined);
  //use forEach inseted of for of because we want to run all the queries in parallel
  await Promise.all(
    optionsToUpdate?.map(async (o) => {
      if (!o?.id) return;
      const updateOptionQuery = removeUndefined({
        data: o.data,
        isCorrect: o.isCorrect,
        isDeleted: o.isDeleted ?? false,
      });
      await prisma.questionOption.update({
        where: {
          id: o.id,
        },
        data: updateOptionQuery,
      });
    })
  );
}

async function addOptions(options: OptionToAdd[]): Promise<void> {
  console.log("adding", options);
  await prisma.questionOption.createMany({
    data: options.map((o) => {
      console.log("creating", o);
      return removeUndefined({
        data: o.data,
        isCorrect: o.isCorrect,
        questionId: o.quesitionId,
      });
    }),
  });
}

function getAddQuestionPromise(
  questions: UpdateQuizQuestionType[],
  quizId: number
): Promise<void>[] {
  console.log("craeting", questions);
  return questions.map((q) =>
    prisma.question
      .create({
        data: removeUndefined({
          question: q.question,
          mediaId: q.media,
          index: q.index,
          time: q.time,
          score: q.score,
          quizId,
        }),
        select: {
          id: true,
        },
      })
      .then(async (id) => {
        const options =
          q.options?.map((o) => ({
            isCorrect: o.isCorrect!,
            data: o.data!,
            questionId: id.id,
          })) ?? [];
        console.log(options);
        const results = await prisma.questionOption.createMany({
          data: options,
        });
        console.log(results);
      })
      .then(() => {
        console.log("done");
      })
  );
}

async function addQuestions(
  questions: UpdateQuizQuestionType[],
  quizId: number
): Promise<void> {
  await Promise.all(getAddQuestionPromise(questions, quizId));
}

async function deleteQuestions(
  questions: UpdateQuizQuestionType[]
): Promise<void> {
  const questionsId =
    questions
      .map((q) => q.id)
      .filter((id: number | undefined): id is number => id !== undefined) ?? [];

  const deleteQuestionsPromise = prisma.question.updateMany({
    where: {
      id: {
        in: questionsId,
      },
    },
    data: {
      isDeleted: true,
    },
  });
  const deleteOptionsPromise = prisma.questionOption.updateMany({
    where: {
      questionId: {
        in: questionsId,
      },
    },
    data: {
      isDeleted: true,
    },
  });
  await Promise.all([deleteQuestionsPromise, deleteOptionsPromise]);
}

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

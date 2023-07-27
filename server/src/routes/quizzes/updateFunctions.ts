import { PrismaClient } from "@prisma/client";
import { removeUndefined } from "../../lib/tools/objects";
import {
  UpdateQuizQuestionOptionType,
  UpdateQuizQuestionType,
  UpdateQuizType,
} from "./validation";

const prisma = new PrismaClient();

export function splitQuestionsToUpdatAddAndDelete(
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

export type OptionToAdd = UpdateQuizQuestionOptionType & {
  quesitionId: number;
};

export function getOptionsToAdd(
  questions: UpdateQuizQuestionType[]
): OptionToAdd[] {
  console.log("getOptionsToAdd", questions);
  return (
    questions
      .map((q) => q.options?.map((o:UpdateQuizQuestionOptionType) => ({ ...o, quesitionId: q.id })))
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

export async function updateBaseQuiz(quiz: UpdateQuizType): Promise<void> {
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

export async function updateQuestions(
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

export async function updateOptions(
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

export async function addOptions(options: OptionToAdd[]): Promise<void> {
  await prisma.questionOption.createMany({
    data: options.map((o) => {
      return removeUndefined({
        data: o.data,
        isCorrect: o.isCorrect,
        questionId: o.quesitionId,
      });
    }),
  });
}

export function getAddQuestionPromise(
  questions: UpdateQuizQuestionType[],
  quizId: number
): Promise<void>[] {
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
          q.options?.map((o:UpdateQuizQuestionOptionType) => ({
            isCorrect: o.isCorrect!,
            data: o.data!,
            questionId: id.id,
          })) ?? [];
        await prisma.questionOption.createMany({
          data: options,
        });
      })
  );
}

export async function addQuestions(
  questions: UpdateQuizQuestionType[],
  quizId: number
): Promise<void> {
  await Promise.all(getAddQuestionPromise(questions, quizId));
}

export async function deleteQuestions(
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

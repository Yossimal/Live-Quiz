import z, { ZodError } from "zod";
import { MediaType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const quizPostSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(3).max(1000),
  image: z.number().optional(),
});
export type QuizType = z.infer<typeof quizPostSchema>;

export function postValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quiz = quizPostSchema.parse(req.body);
    res.locals.newQuiz = quiz;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    // res.status(400).send({ error: (error as ZodError).errors });
    res.status(400).send({
      message:
        "There is an error in the description or the name.\nmake sure you have between 2 to 100 characters in the name and between 3 to 1000 characters in the description.",
    });
  }
}

const quizPutSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(3).max(1000).optional(),
  image: z.string().url().optional(),
});
export type QuizPutType = z.infer<typeof quizPutSchema>;

export function putValidation(req: Request, res: Response, next: NextFunction) {
  try {
    const quiz = quizPutSchema.parse(req.body);
    res.locals.updatedQuiz = quiz;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

const questionPostSchema = z.object({
  quizId: z.number().int().positive().optional(),
  question: z.string().min(2).max(100),
  media: z.string().url().optional(),
  mediaType: z.nativeEnum(MediaType).optional(),
  options: z.array(
    z.object({
      data: z.string().min(1).max(100).optional(),
      isCorrect: z.boolean(),
    })
  ),
});
export type QuestionType = z.infer<typeof questionPostSchema>;

export function addQuestionValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const question = questionPostSchema.parse(req.body);
    res.locals.newQuestion = question;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

const questionPutSchema = z.object({
  id: z.number().int().positive(),
  question: z.string().min(2).max(100).optional(),
  media: z.string().url().optional(),
  mediaType: z.nativeEnum(MediaType).optional(),
  options: z
    .array(
      z.object({
        id: z.number().int().positive().optional(),
        data: z.string().min(2).max(100).optional(),
        isCorrect: z.boolean().optional(),
      })
    )
    .optional(),
});
export type QuestionPutType = z.infer<typeof questionPutSchema>;

export function updateQuestionValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const question = questionPutSchema.parse(req.body);
    res.locals.updatedQuestion = question;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

const updateQuizQuestionOptionSchema = z
  .object({
    id: z.number().int().positive().optional(),
    data: z.string().min(1).max(100).optional(),
    isCorrect: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (schema) =>
      !(!schema.id && (!schema.data || schema.isCorrect === undefined)),
    {
      message: "data and is correct are required for new options",
    }
  );

const updateQuizQuestionSchema = z
  .object({
    id: z.number().int().positive().optional(),
    question: z.string().min(2).max(100).optional(),
    media: z.number().optional(),
    options: z.array(updateQuizQuestionOptionSchema).optional(),
    optionsToDelete: z.array(z.number().int().positive()).optional(),
    index: z.number().int().optional(),
    time: z.number().int().positive().optional(),
    score: z.number().int().positive().optional(),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (schema) =>
      !(
        !schema.id &&
        (!schema.question ||
          schema.index === undefined ||
          schema.time === undefined ||
          schema.score === undefined)
      ),
    {
      message: "question index, score, and time are required for new questions",
    }
  );

const updateQuizSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(3).max(1000).optional(),
    image: z.number().optional(),
    questions: z.array(updateQuizQuestionSchema).optional(),
    questionsToDelete: z.array(z.number().int().positive()).optional(),
  })
  .refine((schema) => !(!schema.id && (!schema.name || !schema.description)), {
    message: "name, description and image are required for new quizzes",
  });

export type UpdateQuizType = z.infer<typeof updateQuizSchema>;
export type UpdateQuizQuestionType = z.infer<typeof updateQuizQuestionSchema>;
export type UpdateQuizQuestionOptionType = z.infer<
  typeof updateQuizQuestionOptionSchema
>;

export function updateQuizValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quiz = updateQuizSchema.parse(req.body);
    res.locals.updatedQuiz = quiz;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

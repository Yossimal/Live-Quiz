import { type } from 'os';
import z, { ZodError } from 'zod';
import { MediaType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";


const quizPostSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(3).max(1000),
    image: z.string().url().optional()
});
export type QuizType = z.infer<typeof quizPostSchema>;

export function postValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const quiz = quizPostSchema.parse(req.body);
        res.locals.newQuiz = quiz;
        next();
    } catch (error: ZodError | unknown) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: (error as ZodError).errors });
    }
}

const quizPutSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(3).max(1000).optional(),
    image: z.string().url().optional()
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
    quizId: z.number().int().positive(),
    question: z.string().min(2).max(100),
    media: z.string().url().optional(),
    mediaType: z.nativeEnum(MediaType).optional(),
    options: z.array(z.object({
        data: z.string().min(2).max(100),
        isCorrect: z.boolean()
    }))
});
export type QuestionType = z.infer<typeof questionPostSchema>;

export function addQuestionValidation(req: Request, res: Response, next: NextFunction) {
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
    options: z.array(z.object({
        id: z.number().int().positive(),
        data: z.string().min(2).max(100).optional(),
        isCorrect: z.boolean().optional()
    }))
});
export type QuestionPutType = z.infer<typeof questionPutSchema>;

export function updateQuestionValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const question = questionPutSchema.parse(req.body);
        res.locals.updatedQuestion = question;
        next();
    } catch (error: ZodError | unknown) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: (error as ZodError).errors });
    }
}


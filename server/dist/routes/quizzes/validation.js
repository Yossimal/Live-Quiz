"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizValidation = exports.updateQuestionValidation = exports.addQuestionValidation = exports.putValidation = exports.postValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const quizPostSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(100),
    description: zod_1.default.string().min(3).max(1000),
    image: zod_1.default.number().optional(),
});
function postValidation(req, res, next) {
    try {
        const quiz = quizPostSchema.parse(req.body);
        res.locals.newQuiz = quiz;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        // res.status(400).send({ error: (error as ZodError).errors });
        res.status(400).send({
            message: "There is an error in the description or the name.\nmake sure you have between 2 to 100 characters in the name and between 3 to 1000 characters in the description.",
        });
    }
}
exports.postValidation = postValidation;
const quizPutSchema = zod_1.default.object({
    id: zod_1.default.number().int().positive(),
    name: zod_1.default.string().min(2).max(100).optional(),
    description: zod_1.default.string().min(3).max(1000).optional(),
    image: zod_1.default.string().url().optional(),
});
function putValidation(req, res, next) {
    try {
        const quiz = quizPutSchema.parse(req.body);
        res.locals.updatedQuiz = quiz;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.putValidation = putValidation;
const questionPostSchema = zod_1.default.object({
    quizId: zod_1.default.number().int().positive().optional(),
    question: zod_1.default.string().min(2).max(100),
    media: zod_1.default.string().url().optional(),
    mediaType: zod_1.default.nativeEnum(client_1.MediaType).optional(),
    options: zod_1.default.array(zod_1.default.object({
        data: zod_1.default.string().min(1).max(100).optional(),
        isCorrect: zod_1.default.boolean(),
    })),
});
function addQuestionValidation(req, res, next) {
    try {
        const question = questionPostSchema.parse(req.body);
        res.locals.newQuestion = question;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.addQuestionValidation = addQuestionValidation;
const questionPutSchema = zod_1.default.object({
    id: zod_1.default.number().int().positive(),
    question: zod_1.default.string().min(2).max(100).optional(),
    media: zod_1.default.string().url().optional(),
    mediaType: zod_1.default.nativeEnum(client_1.MediaType).optional(),
    options: zod_1.default
        .array(zod_1.default.object({
        id: zod_1.default.number().int().positive().optional(),
        data: zod_1.default.string().min(2).max(100).optional(),
        isCorrect: zod_1.default.boolean().optional(),
    }))
        .optional(),
});
function updateQuestionValidation(req, res, next) {
    try {
        const question = questionPutSchema.parse(req.body);
        res.locals.updatedQuestion = question;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.updateQuestionValidation = updateQuestionValidation;
const updateQuizQuestionOptionSchema = zod_1.default
    .object({
    id: zod_1.default.number().int().positive().optional(),
    data: zod_1.default.string().min(1).max(100).optional(),
    isCorrect: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default.boolean().optional(),
})
    .refine((schema) => !(!schema.id && (!schema.data || schema.isCorrect === undefined)), {
    message: "data and is correct are required for new options",
});
const updateQuizQuestionSchema = zod_1.default
    .object({
    id: zod_1.default.number().int().positive().optional(),
    question: zod_1.default.string().min(2).max(100).optional(),
    media: zod_1.default.number().optional(),
    options: zod_1.default.array(updateQuizQuestionOptionSchema).optional(),
    optionsToDelete: zod_1.default.array(zod_1.default.number().int().positive()).optional(),
    index: zod_1.default.number().int().optional(),
    time: zod_1.default.number().int().positive().optional(),
    score: zod_1.default.number().int().positive().optional(),
    isDeleted: zod_1.default.boolean().optional(),
})
    .refine((schema) => !(!schema.id &&
    (!schema.question ||
        schema.index === undefined ||
        schema.time === undefined ||
        schema.score === undefined)), {
    message: "question index, score, and time are required for new questions",
});
const updateQuizSchema = zod_1.default
    .object({
    id: zod_1.default.number().int().positive(),
    name: zod_1.default.string().min(2).max(100).optional(),
    description: zod_1.default.string().min(3).max(1000).optional(),
    image: zod_1.default.number().optional(),
    questions: zod_1.default.array(updateQuizQuestionSchema).optional(),
    questionsToDelete: zod_1.default.array(zod_1.default.number().int().positive()).optional(),
})
    .refine((schema) => !(!schema.id && (!schema.name || !schema.description)), {
    message: "name, description and image are required for new quizzes",
});
function updateQuizValidation(req, res, next) {
    try {
        const quiz = updateQuizSchema.parse(req.body);
        res.locals.updatedQuiz = quiz;
        next();
    }
    catch (error) {
        //TODO :: send clear string to the end user with the error!!!!!!!!!!
        res.status(400).send({ error: error.errors });
    }
}
exports.updateQuizValidation = updateQuizValidation;
//# sourceMappingURL=validation.js.map
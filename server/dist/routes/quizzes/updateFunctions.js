"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestions = exports.addQuestions = exports.getAddQuestionPromise = exports.addOptions = exports.updateOptions = exports.updateQuestions = exports.updateBaseQuiz = exports.getOptionsToAdd = exports.splitQuestionsToUpdatAddAndDelete = void 0;
const client_1 = require("@prisma/client");
const objects_1 = require("../../lib/tools/objects");
const prisma = new client_1.PrismaClient();
function splitQuestionsToUpdatAddAndDelete(questions) {
    const questionsToUpdate = questions.filter((q) => q.id !== undefined && !q.isDeleted);
    const questionsToAdd = questions.filter((q) => q.id === undefined);
    const questionsToDelete = questions.filter((q) => q.id !== undefined && q.isDeleted);
    console.log("splitted", [
        questionsToUpdate,
        questionsToDelete,
        questionsToAdd,
    ]);
    return [questionsToUpdate, questionsToAdd, questionsToDelete];
}
exports.splitQuestionsToUpdatAddAndDelete = splitQuestionsToUpdatAddAndDelete;
function getOptionsToAdd(questions) {
    var _a;
    console.log("getOptionsToAdd", questions);
    return ((_a = questions
        .map((q) => { var _a; return (_a = q.options) === null || _a === void 0 ? void 0 : _a.map((o) => (Object.assign(Object.assign({}, o), { quesitionId: q.id }))); })
        .flat()
        .filter((o) => {
        console.log(o, (o === null || o === void 0 ? void 0 : o.quesitionId) !== undefined && (o === null || o === void 0 ? void 0 : o.id) === undefined, o === null || o === void 0 ? void 0 : o.quesitionId, o === null || o === void 0 ? void 0 : o.id);
        return (o != undefined && o.quesitionId !== undefined && o.id === undefined);
    })) !== null && _a !== void 0 ? _a : []);
}
exports.getOptionsToAdd = getOptionsToAdd;
async function updateBaseQuiz(quiz) {
    const updateQuizQuery = (0, objects_1.removeUndefined)({
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
exports.updateBaseQuiz = updateBaseQuiz;
async function updateQuestions(questionsToUpdate) {
    //use forEach inseted of for of because we want to run all the queries in parallel
    await Promise.all(questionsToUpdate === null || questionsToUpdate === void 0 ? void 0 : questionsToUpdate.map(async (q) => {
        var _a;
        if (!q.id)
            return;
        const updateQuestionQuery = (0, objects_1.removeUndefined)({
            question: q.question,
            mediaId: q.media,
            isDeleted: (_a = q.isDeleted) !== null && _a !== void 0 ? _a : false,
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
    }));
}
exports.updateQuestions = updateQuestions;
async function updateOptions(questionsToUpdate) {
    const optionsToUpdate = questionsToUpdate === null || questionsToUpdate === void 0 ? void 0 : questionsToUpdate.map((q) => q.options).flat().filter((o) => (o === null || o === void 0 ? void 0 : o.id) !== undefined);
    //use forEach inseted of for of because we want to run all the queries in parallel
    await Promise.all(optionsToUpdate === null || optionsToUpdate === void 0 ? void 0 : optionsToUpdate.map(async (o) => {
        var _a;
        if (!(o === null || o === void 0 ? void 0 : o.id))
            return;
        const updateOptionQuery = (0, objects_1.removeUndefined)({
            data: o.data,
            isCorrect: o.isCorrect,
            isDeleted: (_a = o.isDeleted) !== null && _a !== void 0 ? _a : false,
        });
        await prisma.questionOption.update({
            where: {
                id: o.id,
            },
            data: updateOptionQuery,
        });
    }));
}
exports.updateOptions = updateOptions;
async function addOptions(options) {
    await prisma.questionOption.createMany({
        data: options.map((o) => {
            return (0, objects_1.removeUndefined)({
                data: o.data,
                isCorrect: o.isCorrect,
                questionId: o.quesitionId,
            });
        }),
    });
}
exports.addOptions = addOptions;
function getAddQuestionPromise(questions, quizId) {
    return questions.map((q) => prisma.question
        .create({
        data: (0, objects_1.removeUndefined)({
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
        var _a, _b;
        const options = (_b = (_a = q.options) === null || _a === void 0 ? void 0 : _a.map((o) => ({
            isCorrect: o.isCorrect,
            data: o.data,
            questionId: id.id,
        }))) !== null && _b !== void 0 ? _b : [];
        await prisma.questionOption.createMany({
            data: options,
        });
    }));
}
exports.getAddQuestionPromise = getAddQuestionPromise;
async function addQuestions(questions, quizId) {
    await Promise.all(getAddQuestionPromise(questions, quizId));
}
exports.addQuestions = addQuestions;
async function deleteQuestions(questions) {
    var _a;
    const questionsId = (_a = questions
        .map((q) => q.id)
        .filter((id) => id !== undefined)) !== null && _a !== void 0 ? _a : [];
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
exports.deleteQuestions = deleteQuestions;
//# sourceMappingURL=updateFunctions.js.map
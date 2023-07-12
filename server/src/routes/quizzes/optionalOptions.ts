import { PrismaClient, QuestionOption } from "@prisma/client";

const prisma = new PrismaClient();


type QuestionOptionDto = {
    data: string;
    isCorrect: boolean;
}

export function addOptions(questionId: number, options: QuestionOptionDto[]) {
    let reslut: QuestionOption[] = [];
    options.forEach(async (option) => {
        const optionalOption = await prisma.questionOption.create({
            data: {
                questionId,
                data: option.data,
                isCorrect: option.isCorrect
            }
        }) as QuestionOption;
        reslut.push(optionalOption);
    });
    return reslut;
}

type QuestionOptionOnPutDto = {
    id: number;
    data?: string;
    isCorrect?: boolean;
}

export function updatedOptions(options: QuestionOptionOnPutDto[]) {
    let reslut: QuestionOption[] = [];
    options.forEach(async (option) => {
        const optionalOption = await prisma.questionOption.update({
            where: {
                id: option.id,
            },
            data: {
                isCorrect: option.isCorrect
            }
        }) as QuestionOption;
        reslut.push(optionalOption);
    });
    return reslut;
}
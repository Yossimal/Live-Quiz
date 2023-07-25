import { Player, AnswerResult } from './types'
import { Question, QuestionOption } from "@prisma/client";


export type ServerToClientEvents = {
    questionTimeuot: () => void;
    timeLeft: (time: number) => void;
    currentQuestion: (question: Question) => void;
}

export type ServerToAdminClientEvents = {
    getGameToken: (token: string) => void;
    newPlayer: (player: Player) => void;
    totalAnswerResult: (totalResult: AnswerResult[]) => void;
} & ServerToClientEvents;

export type ServerToUserClientEvents = {
    currentQuestion: (question: Question) => void;
    answerResult: (result: AnswerResult) => void;
    playerJoined: (player: Player) => void;
} & ServerToClientEvents;

export type AdminClientToServerEvents = {
    openGame: (gameId: number) => void;
    startGame: (token: string) => void;
}

export type UserClientToServerEvents = {
    joinGame: (token: string, name: string) => void;
    submitAnswer: (answer: QuestionOption) => void;
}
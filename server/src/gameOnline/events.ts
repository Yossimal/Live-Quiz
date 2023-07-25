import { Player, AnswerResult, QuestionType } from './types'


export type ServerToClientEvents = {
    questionTimeuot: () => void;
    timeLeft: (time: number) => void;
    currentQuestion: (question: QuestionType) => void;
    gameOver: () => void;
}

export type ServerToAdminClientEvents = {
    getGameToken: (token: string) => void;
    newPlayer: (player: Player) => void;
    totalAnswerResult: (totalResult: AnswerResult[]) => void;
    gameError: (error: string) => void;
} & ServerToClientEvents;

export type ServerToUserClientEvents = {
    answerResult: (result: AnswerResult) => void;
    playerJoined: (player: Player) => void;
} & ServerToClientEvents;

export type AdminClientToServerEvents = {
    openGame: (gameId: number) => void;
    startGame: (token: string) => void;
}

export type UserClientToServerEvents = {
    joinGame: (token: string, name: string) => void;
    submitAnswer: (token: string, optionId: number) => void;
}
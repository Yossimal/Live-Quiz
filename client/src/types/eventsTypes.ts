import { PlayerType, QuestionType, AnswerResultType, QuestionOptionType } from './dataObjects'

export type ServerToClientEvents = {
    questionTimeuot: () => void;
    timeLeft: (time: number) => void;
    currentQuestion: (question: QuestionType) => void;
}

export type ServerToAdminClientEvents = {
    getGameToken: (token: string) => void;
    newPlayer: (player: PlayerType) => void;
    totalAnswerResult: (totalResult: AnswerResultType[]) => void;
} & ServerToClientEvents;

export type ServerToUserClientEvents = {
    currentQuestion: (question: QuestionType) => void;
    answerResult: (result: AnswerResultType) => void;
    playerJoined: (player: PlayerType) => void;
} & ServerToClientEvents;

export type AdminClientToServerEvents = {
    openGame: (gameId: number) => void;
    startGame: (token: string) => void;
}

export type UserClientToServerEvents = {
    joinGame: (token: string, name: string) => void;
    submitAnswer: (answer: QuestionOptionType) => void;
}
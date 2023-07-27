import { Player, AnswerResult, QuestionType, GameData } from './types'


export type ServerToClientEvents = {
    questionTimeuot: () => void;
    timeLeft: (time: number) => void;
    currentQuestion: (question: QuestionType) => void;
    gameOver: () => void;
    answerResult: (result: AnswerResult) => void;
    gameError: (error: string) => void;
    gameData: (data: GameData) => void;
}

export type ServerToAdminClientEvents = {
    getGameToken: (token: string) => void;
    newPlayer: (player: Player) => void;
    gameError: (error: string) => void;
} & ServerToClientEvents;

export type ServerToUserClientEvents = {
    playerJoined: (player: Player) => void;
    gameData: (data: GameData) => void;
} & ServerToClientEvents;

export type ClientToServerEvents = {
    getGameData: (token: string) => void;
}

export type AdminClientToServerEvents = {
    openGame: (gameId: number) => void;
    startGame: (token: string) => void;
} & ClientToServerEvents;


export type UserClientToServerEvents = {
    joinGame: (token: string, name: string) => void;
    submitAnswer: (token: string, playerId: string, optionId: number) => void;
} & ClientToServerEvents;

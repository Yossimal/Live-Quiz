import { Socket } from "socket.io";
import {
    ServerToAdminClientEvents,
    ServerToUserClientEvents,
    AdminClientToServerEvents,
    UserClientToServerEvents,
} from './events';

export type AnswerResult = {
    playerId: number;
    questionId: number;
    option: QuestionOptionType;
    isRight: boolean;
    score: number;
}

export type GameData = {
    name: string;
    id: number;
    description: string;
    questionsCount: number;
    totalTime: number;
}

export type Player = {
    id: number;
    name: string;
    score: number;
    gameId: number;
    gameName: string;
}

export type MySocket = Socket<
    AdminClientToServerEvents & UserClientToServerEvents,
    ServerToAdminClientEvents & ServerToUserClientEvents,
    any,
    SocketData>;

export type PlayerInGame = Player & {
    socket: MySocket;
}

export type GameCreator = {
    id: number;
    socket: MySocket;
}

export type QuestionOptionType = {
    id: number;
    data: string;
    questionId: number;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export enum MediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    NONE = "NONE",
}

export type QuestionType = {
    id: number;
    question: string;
    quizId: number;
    options: QuestionOptionType[];
    quiz?: QuizType;
    //mediaType: MediaType;
    //media?: string;
    createdAt: Date;
    updatedAt: Date;
    time: number;
    mediaId: number | null;
    index: number;
};

export type QuizType = {
    id: number;
    name: string;
    description: string;
    imageId: number | null;
    questions: QuestionType[];
    creatorId: number;
    createdAt: Date;
    updatedAt: Date;
};


export type SocketData = {
    name: string;
}


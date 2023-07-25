export type AnswerResult = {
    playerId: number | string;
    questionId: number;
    isRight: boolean;
}

export type Player = {
    id: number | string;
    name: string;
    score: number;
}


export type SocketData = {
    name: string;
}
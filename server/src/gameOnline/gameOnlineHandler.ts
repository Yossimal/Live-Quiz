import {
    MySocket,
    GameCreator,
    PlayerInGame,
    QuizType,
    QuestionType,
    QuestionOptionType
} from './types';
import { PrismaClient } from "@prisma/client";
import Game from "./Game";

const prisma = new PrismaClient();


const games: Game[] = [];

export default function gameOnlinHandler(socket: MySocket) {
    console.log(`user connected: ${socket.id}`);

    socket.on('openGame', async gameId => {
        console.log('openGame', gameId);
        const quizInGame = await getQuiz(gameId, socket);
        if (!quizInGame) {
            return;
        }
        const creator: GameCreator = {
            id: quizInGame.creatorId,
            socket
        };
        const game = new Game(quizInGame, creator);
        games.push(game);
        socket.emit('getGameToken', game.gameToken);
    });

    socket.on('startGame', async token => {
        const game = games.find(g => g.gameToken === token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        if (game.players.length === 0) {
            socket.emit('gameError', 'no players');
            return;
        }
        game.startGame();
    });

    socket.on('joinGame', (token, name) => {
        console.log('joinGame', token, name);
        const game = games.find(g => g.gameToken === token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        const player: PlayerInGame = {
            name,
            id: socket.id,
            score: 0,
            gameId: game.quiz.id,
            gameName: game.quiz.name,
            socket
        };
        game.addPlayer(player);
    });

    socket.on('submitAnswer', (token, optionId) => {
        const game = games.find(g => g.gameToken === token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        const player = game.players.find(p => p.id === socket.id);
        if (!player) {
            socket.emit('gameError', 'player not found');
            return;
        }
        game.playerAnswered(player, optionId);
    });

    socket.on('disconnect', (reason) => {
        console.log(`user disconnected: ${reason}, ${socket.id}`);
    });
}

async function getQuiz(quizId: number, socket: MySocket) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId
        },
        include: {
            questions: {
                include: {
                    options: true,
                    media: true
                }
            }
        }
    });
    if (!quiz) {
        socket.emit('gameError', 'quiz not found');
        return;
    }
    const questions = quiz.questions.map(q => {
        const question: QuestionType = {
            ...q,
            options: q.options.map(o => {
                const option: QuestionOptionType = {
                    ...o
                };
                return option;
            })
        };
        return question;
    });
    const quizInGame: QuizType = {
        ...quiz,
        questions: questions
    }

    return quizInGame;
}

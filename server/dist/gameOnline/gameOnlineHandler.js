"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const Game_1 = __importDefault(require("./Game"));
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
const games = new Map();
function gameOnlinHandler(socket) {
    console.log(`user connected: ${socket.id}`);
    socket.on('openGame', async (gameId) => {
        console.log('openGame', gameId);
        const quizInGame = await getQuiz(gameId, socket);
        if (!quizInGame) {
            return;
        }
        const creator = {
            id: quizInGame.creatorId,
            socket
        };
        const game = new Game_1.default(quizInGame, creator);
        games.set(game.gameToken, game);
    });
    socket.on('startGame', async (token) => {
        const game = games.get(token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        if (game.players.length === 0) {
            socket.emit('gameError', 'no players');
            return;
        }
        console.log('startGame', game.quiz.name);
        await game.startGame();
    });
    socket.on('getGameData', token => {
        const game = games.get(token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        socket.emit('gameData', {
            name: game.quiz.name,
            id: game.quiz.id,
            description: game.quiz.description,
            questionsCount: game.quiz.questions.length,
            totalTime: game.quiz.questions.reduce((acc, q) => acc + q.time, 0)
        });
    });
    socket.on('joinGame', (token, name) => {
        console.log('joinGame', token, name);
        const game = games.get(token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        const playerUUID = (0, crypto_1.randomUUID)();
        const player = {
            name,
            id: playerUUID,
            score: 0,
            gameId: game.quiz.id,
            gameName: game.quiz.name,
            socket
        };
        game.addPlayer(player);
    });
    socket.on('submitAnswer', (token, playerId, optionId) => {
        const game = games.get(token);
        if (!game) {
            socket.emit('gameError', 'game not found');
            return;
        }
        const player = game.players.find(p => p.id === playerId);
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
exports.default = gameOnlinHandler;
async function getQuiz(quizId, socket) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId
        },
        include: {
            questions: {
                include: {
                    options: {
                        where: {
                            isDeleted: false
                        }
                    },
                    media: true
                },
                orderBy: {
                    index: 'asc'
                },
                where: {
                    isDeleted: false
                }
            }
        }
    });
    if (!quiz) {
        socket.emit('gameError', 'quiz not found');
        return;
    }
    const questions = quiz.questions.map((q, i) => {
        const question = Object.assign(Object.assign({}, q), { index: i, options: q.options.map(o => {
                const option = Object.assign({}, o);
                return option;
            }) });
        return question;
    });
    const quizInGame = Object.assign(Object.assign({}, quiz), { questions: questions });
    return quizInGame;
}
//# sourceMappingURL=gameOnlineHandler.js.map
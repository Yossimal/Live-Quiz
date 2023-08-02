"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const server_1 = require("../server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Game {
    constructor(quiz, creator) {
        this.questionIndex = 0;
        this.gameStarted = false;
        this.timeBetweenQuestions = 10000;
        this.answerResults = [];
        this.players = [];
        this.quiz = quiz;
        this.gameToken = (0, crypto_1.scryptSync)(`${quiz.id}${Date.now()}`, 'salt', 16).toString('hex');
        creator.socket.join(this.gameToken);
        creator.socket.emit('getGameToken', this.gameToken);
        this.creator = creator;
    }
    addPlayer(player) {
        if (this.gameStarted) {
            return;
        }
        player.socket.join(this.gameToken);
        this.players.push(player);
        const { id, name, score, gameName, gameId } = player;
        const playerDto = { id: id, name, score, gameName, gameId };
        this.creator.socket.emit('newPlayer', playerDto);
        player.socket.emit('playerJoined', playerDto);
    }
    async startGame() {
        this.gameStarted = true;
        await this.nextQuestion();
    }
    async nextQuestion() {
        if (this.questionIndex >= this.quiz.questions.length) {
            await this.gameOver();
            return;
        }
        const question = this.quiz.questions[this.questionIndex];
        let time = question.time;
        const sendTimeLeft = () => {
            if (time >= 0) {
                server_1.io.to(this.gameToken).emit('timeLeft', time);
                time--;
                setTimeout(sendTimeLeft, 1000);
            }
            else {
                this.questionIndex++;
                this.players.forEach(player => {
                    const result = this.answerResults
                        .find(r => r.playerId === player.id && r.questionId === question.id);
                    if (result) {
                        player.socket.emit('answerResult', result);
                    }
                });
                const total = this.answerResults
                    .filter(r => r.questionId === question.id);
                console.log('total', total);
                console.log('creator soc', this.creator.socket.id);
                this.creator.socket.emit('totalAnswersResults', total);
                setTimeout(async () => await this.nextQuestion(), this.timeBetweenQuestions);
            }
        };
        server_1.io.to(this.gameToken).emit('currentQuestion', question);
        sendTimeLeft();
    }
    async gameOver() {
        console.log('gameOver');
        server_1.io.to(this.gameToken).emit('gameOver');
        const onlineQuiz = await prisma.onlineQuiz.create({
            data: {
                quizId: this.quiz.id,
            }
        });
        this.creator.socket.disconnect();
        this.players.forEach(player => {
            player.socket.disconnect();
        });
    }
    playerAnswered(player, optionId) {
        const question = this.quiz.questions[this.questionIndex];
        const answer = question.options.find(o => o.id === optionId);
        if (!answer) {
            return;
        }
        const correct = answer.isCorrect;
        const result = {
            playerId: player.id,
            questionId: question.id,
            isRight: correct,
            option: answer,
            score: correct ? question.score : 0
        };
        this.answerResults.push(result);
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map
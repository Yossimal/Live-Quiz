import { scryptSync, randomUUID } from 'crypto';
import { PlayerInGame, QuizType, GameCreator, AnswerResult } from './types';
import { io } from '../server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();




export default class Game {
    players: PlayerInGame[];
    quiz: QuizType;
    gameToken: string;
    private questionIndex: number = 0;
    creator: GameCreator;
    gameStarted: boolean = false;
    private readonly timeBetweenQuestions: number = 10000;
    private answerResults: AnswerResult[] = [];
    constructor(quiz: QuizType, creator: GameCreator) {
        this.players = [];
        this.quiz = quiz;
        this.gameToken = scryptSync(`${quiz.id}${Date.now()}`, 'salt', 16).toString('hex');
        creator.socket.join(this.gameToken);
        creator.socket.emit('getGameToken', this.gameToken);
        this.creator = creator;
    }

    addPlayer(player: PlayerInGame) {
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

    private async nextQuestion() {
        if (this.questionIndex >= this.quiz.questions.length) {
            await this.gameOver();
            return;
        }

        const question = this.quiz.questions[this.questionIndex];
        let time = question.time;

        const sendTimeLeft = () => {
            if (time >= 0) {
                io.to(this.gameToken).emit('timeLeft', time);
                time--;
                setTimeout(sendTimeLeft, 1000);
            } else {
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
                console.log('creator soc', this.creator.socket.id)
                this.creator.socket.emit('totalAnswersResults', total);
                setTimeout(async () => await this.nextQuestion(),
                    this.timeBetweenQuestions);
            }
        };

        io.to(this.gameToken).emit('currentQuestion', question);
        sendTimeLeft();
    }

    async gameOver() {
        console.log('gameOver');
        io.to(this.gameToken).emit('gameOver');

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

    playerAnswered(player: PlayerInGame, optionId: number) {
        const question = this.quiz.questions[this.questionIndex];
        const answer = question.options.find(o => o.id === optionId);
        if (!answer) {
            return;
        }
        const correct = answer.isCorrect;
        const result: AnswerResult = {
            playerId: player.id,
            questionId: question.id,
            isRight: correct,
            option: answer,
            score: correct ? question.score : 0
        };
        this.answerResults.push(result);
    }
}
import { scryptSync, randomUUID } from 'crypto';
import { PlayerInGame, QuizType, GameCreator, AnswerResult } from './types';
import { io } from '../server'


export default class Game {
    players: PlayerInGame[];
    quiz: QuizType;
    gameToken: string;
    private questionIndex: number = 0;
    creator: GameCreator;
    gameStarted: boolean = false;
    private readonly timeBetweenQuestions: number = 10000;
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
        const { name, score, gameName, gameId } = player;
        const playerUUID = randomUUID();
        const playerDto = { id: playerUUID, name, score, gameName, gameId };
        this.creator.socket.emit('newPlayer', playerDto);
        player.socket.emit('playerJoined', playerDto);
    }

    startGame() {
        this.gameStarted = true;
        this.nextQuestion();
    }

    private nextQuestion() {
        if (this.questionIndex >= this.quiz.questions.length) {
            this.gameOver();
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
                setTimeout(() => this.nextQuestion(), this.timeBetweenQuestions);
            }
        };

        io.to(this.gameToken).emit('currentQuestion', question);
        sendTimeLeft();
    }

    gameOver() {
        console.log('gameOver');
        io.to(this.gameToken).emit('gameOver');

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
            score: correct ? question.time + 1 : 0
        };
        this.creator.socket.emit('answerResult', result);
        player.socket.emit('answerResult', result);
    }
}
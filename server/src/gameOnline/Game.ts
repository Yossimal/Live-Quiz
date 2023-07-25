import { scryptSync } from 'crypto';
import { PlayerInGame, QuizType, GameCreator, AnswerResult } from './types';
import { io } from '../server'


export default class Game {
    players: PlayerInGame[];
    quiz: QuizType;
    gameToken: string;
    currentQuestionIndex: number = 0;
    creator: GameCreator;
    gameStarted: boolean = false;
    constructor(quiz: QuizType, creator: GameCreator) {
        this.players = [];
        this.quiz = quiz;
        this.gameToken = scryptSync(`${quiz.id}${Date.now()}`, 'salt', 16).toString('hex');
        creator.socket.join(this.gameToken);
        this.creator = creator;
    }

    addPlayer(player: PlayerInGame) {
        if (this.gameStarted) {
            return;
        }
        const { name, id, score, gameName, gameId } = player;
        const playerDto = { name, id, score, gameName, gameId };
        this.creator.socket.emit('newPlayer', playerDto);
        player.socket.join(this.gameToken);
        this.players.push(player);
        player.socket.emit('playerJoined', playerDto);
    }

    startGame() {
        this.gameStarted = true;
        // this.creator.socket.emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex])
        // this.players.forEach(player => {
        //     player.socket
        //         .emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex]);
        // });

        io.in(this.gameToken).to(this.gameToken).emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex]);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.quiz.questions.length) {
            this.gameOver();
            return;
        }
        // this.creator.socket.emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex])
        // this.players.forEach(player => {
        //     player.socket.to(this.gameToken)
        //         .emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex]);
        // });
        io.to(this.gameToken).emit('currentQuestion', this.quiz.questions[this.currentQuestionIndex]);
    }

    gameOver() {
        //this.creator.socket.emit('gameOver');
        // this.players.forEach(player => {
        //     player.socket.to(this.gameToken).emit('gameOver');
        // });
        io.to(this.gameToken).emit('gameOver');

        this.creator.socket.disconnect();
        this.players.forEach(player => {
            player.socket.disconnect();
        });
    }

    playerAnswered(player: PlayerInGame, optionId: number) {
        const question = this.quiz.questions[this.currentQuestionIndex];
        const answer = question.options.find(o => o.id === optionId);
        if (!answer) {
            return;
        }
        const correct = answer.isCorrect;
        const result: AnswerResult = {
            playerId: player.id,
            questionId: question.id,
            isRight: correct,
            score: correct ? question.time + 1 : 0
        };
        this.creator.socket.emit('answerResult', result);
        player.socket.emit('answerResult', result);
    }
}
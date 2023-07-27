import { userSocket } from "../../../common/sockets";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { QuestionType, QuestionOptionType, PlayerType, AnswerResultType, GameData } from "../../../types/dataObjects";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { useSession } from "../../../hooks/useSession";
import LiveGame from "../../../components/LiveGame";

export default function PlayGame() {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const { gameToken, playerName } = useParams<{ gameToken: string, playerName: string }>();
    const [player, setPlayer] = useSession<PlayerType | null>('player', null);
    const { state } = useLocation();
    const gameData = state as GameData;
    console.log(gameData);
    const toast = useRef<Toast>(null);

    const onConnect = () => {
        if (!gameToken || !playerName) throw 'gameToken or name is null';
        userSocket.emit('joinGame', gameToken, playerName);
    }

    const onCurrentQuestion = (question: QuestionType) => {
        setCurrentQuestion(question);
    }

    const onTimeLeft = (time: number) => {
        setTimeLeft(time);
    }

    const onAnswerResult = (result: AnswerResultType) => {
        toast.current?.show({
            severity: result.isRight ? 'success' : 'error',
            summary: result.isRight ? 'Correct' : 'Wrong',
            detail: result.isRight ? 'Your answer is correct' : 'Your answer is wrong',
            life: 3000
        });
        setScore(prev => prev + result.score);
    }

    const onPlayerJoined = (player: PlayerType) => {
        console.log(`player ${JSON.stringify(player)}`);
        setPlayer(player);
    }

    useEffect(() => {
        userSocket.connect();
        userSocket.on('connect', onConnect);
        userSocket.on('currentQuestion', onCurrentQuestion);
        userSocket.on('timeLeft', onTimeLeft);
        userSocket.on('answerResult', onAnswerResult);
        userSocket.on('playerJoined', onPlayerJoined);

        return () => {
            userSocket.off('connect', onConnect);
            userSocket.off('currentQuestion', onCurrentQuestion);
            userSocket.off('timeLeft', onTimeLeft);
            userSocket.off('answerResult', onAnswerResult);
            userSocket.off('playerJoined', onPlayerJoined);
            userSocket.disconnect();
        }
    }, []);

    const onSelectedOption = (option: QuestionOptionType) => {
        if (!gameToken) throw 'gameToken is null';
        userSocket.emit('submitAnswer', gameToken, option.id);
    }

    return (
        <div className="flex flex-column align-items-center justify-content-center">
            {!currentQuestion && <h1 className="text-center">Welcome {player?.name}</h1>}
            {currentQuestion ?
                <LiveGame
                    gameData={gameData}
                    question={currentQuestion}
                    time={timeLeft}
                    onSelectedOption={onSelectedOption} />
                : <h1>Waiting for question</h1>
            }
            <Badge className="w-min" value={score} size="xlarge" severity="success"></Badge>
            <Toast ref={toast} />
        </div>
    )
}


import { userSocket } from "../../../common/sockets";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import CurrentQuestionOnLiveGame from "../../../components/CurrentQuestionOnLiveGame";
import { QuestionType, QuestionOptionType, PlayerType, AnswerResultType } from "../../../types/dataObjects";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";

export default function PlayGame() {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
    const [time, setTime] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const { gameToken } = useParams<{ gameToken: string }>();
    const { state } = useLocation();
    const player = state as PlayerType;

    const toast = useRef<Toast>(null);

    const onConnect = () => {
        console.log('connected');
    }

    const onCurrentQuestion = (question: QuestionType) => {
        setCurrentQuestion(question);
    }

    const onTimeLeft = (time: number) => {
        setTime(time);
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

    useEffect(() => {
        if (!gameToken) return;
        userSocket.connect();
        userSocket.on('connect', onConnect);
        userSocket.on('currentQuestion', onCurrentQuestion);
        userSocket.on('timeLeft', onTimeLeft);
        userSocket.on('answerResult', onAnswerResult);

        return () => {
            userSocket.off('connect', onConnect);
            userSocket.off('currentQuestion', onCurrentQuestion);
            userSocket.off('timeLeft', onTimeLeft);
            userSocket.off('answerResult', onAnswerResult);
            userSocket.disconnect();
        }
    }, [gameToken]);

    const onSelectedOption = (option: QuestionOptionType) => {
        userSocket.emit('submitAnswer', gameToken!, option.id);
    }

    return (
        <div className="flex flex-column align-content-center justify-content-center">
            <h1 className="text-center">Welcome {player.name}</h1>
            {currentQuestion ?
                <CurrentQuestionOnLiveGame
                    question={currentQuestion}
                    onSelectedOption={onSelectedOption}
                    time={time}
                /> :
                <h1>Waiting for question</h1>
            }
            <Badge value={score} size="xlarge" severity="success"></Badge>
            <Toast ref={toast} />
        </div>
    )
}


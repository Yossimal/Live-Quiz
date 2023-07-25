import { userSocket } from "../../../common/sockets";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CurrentQuestionOnLiveGame from "../../../components/CurrentQuestionOnLiveGame";
import { QuestionType, QuestionOptionType } from "../../../types/dataObjects";

export default function PlayGame() {
    const [question, setQuestion] = useState<QuestionType>();
    const [time, setTime] = useState<number>(0);
    const { gameToken } = useParams<{ gameToken: string }>();

    useEffect(() => {
        if (!gameToken) return;
        userSocket.connect();
        userSocket.on('connect', () => {
            console.log('connected');
            userSocket.on('currentQuestion', question => {
                setQuestion(question);
            });
            userSocket.on('timeLeft', time => {
                setTime(time);
            });
        });
    }, [gameToken]);

    const onSelectedOption = (option: QuestionOptionType) => {
        userSocket.emit('submitAnswer', option);
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {question ?
                <CurrentQuestionOnLiveGame
                    question={question}
                    onSelectedOption={onSelectedOption}
                    time={time}
                /> :
                <h1>Waiting for question</h1>
            }
        </div>
    )
}


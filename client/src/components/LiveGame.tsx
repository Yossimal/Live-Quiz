import { toHHMMSS } from "../common/objectsTools";
import { GameData, QuestionOptionType, QuestionType } from "../types/dataObjects";
import QuestionOnLiveGame from "./QuestionOnLiveGame";
import { useRef, useEffect } from 'react';

type Props = {
    question: QuestionType;
    onSelectedOption?: (option: QuestionOptionType) => void;
    time: number;
    gameData: GameData;
}

export default function LiveGame({ gameData, question, onSelectedOption, time }: Props) {
    const questionCounter = useRef(0);

    useEffect(() => {
        questionCounter.current = questionCounter.current + 1;
    }, [question]);
    return (
        <div className="">
            <div className="flex justify-content-between">
                <div className="flex flex-row align-items-center ">
                    <i className="pi pi-spin pi-clock"></i>
                    <p>{toHHMMSS(gameData.totalTime)}</p>
                </div>
                <p>{`Question ${questionCounter.current} out of ${gameData.questionsCount}`}</p>
            </div>
            <QuestionOnLiveGame
                question={question}
                onSelectedOption={onSelectedOption}
                time={time} />
        </div>
    )
}
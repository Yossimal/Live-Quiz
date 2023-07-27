import { toHHMMSS } from "../common/objectsTools";
import { GameData, QuestionOptionType, QuestionType } from "../types/dataObjects";
import QuestionOnLiveGame from "./QuestionOnLiveGame";
import { useEffect, useState } from 'react';

type Props = {
    question: QuestionType;
    onSelectedOption?: (option: QuestionOptionType) => void;
    time: number;
    gameData: GameData;
}

export default function LiveGame({ gameData, question, onSelectedOption, time }: Props) {
    return (
        <div className="surface-100 p-3 w-10">
            <div className="flex justify-content-between">
                <div className="flex flex-row gap-2 align-items-center ">
                    <i className="pi pi-spin pi-clock"></i>
                    <p>{toHHMMSS(gameData.totalTime)}</p>
                </div>
                <p>{`Question ${question.index + 1} out of ${gameData.questionsCount}`}</p>
            </div>
            <QuestionOnLiveGame
                question={question}
                onSelectedOption={onSelectedOption}
                time={time} />
        </div>
    )
}
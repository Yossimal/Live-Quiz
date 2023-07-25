import { useEffect, useState } from 'react';
import { QuestionType, QuestionOptionType } from '../types/dataObjects';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

type Props = {
    question: QuestionType;
    onSelectedOption: (option: QuestionOptionType) => void;
    time: number;
}

export default function CurrentQuestionOnLiveGame({ question, onSelectedOption, time }: Props) {
    const [selectedOption, setSelectedOption] = useState<QuestionOptionType>();

    useEffect(() => {
        console.log(question);
    }, [question]);

    useEffect(() => {
        if (!selectedOption)
            return;

        onSelectedOption(selectedOption);
    }, [selectedOption]);

    if (!question) return <></>;

    const colors = ['red', 'blue', 'green', 'yellow'];
    const colorTemplate = (option: QuestionOptionType & { color: string }) => {
        return (
            <Button
                className='m-2 p-2'
                style={{ color: option.color }}
            />
        )
    }

    const timeTemplate = (value: number) => {
        return (
            <>
                {value}/<b>{question.time}</b>
            </>
        );
    };

    return (
        <div>
            <h1>{question.question}</h1>
            <div className="card flex justify-content-center">
                <SelectButton
                    value={selectedOption}
                    onChange={(e: SelectButtonChangeEvent) => setSelectedOption(e.value)}
                    optionLabel="data"
                    itemTemplate={colorTemplate}
                    options={question.options?.map(opt => {
                        return {
                            ...opt,
                            color: colors.concat().sort(() => Math.random() - 0.5)[0]
                        }
                    })} />
                <div className="card">
                    <ProgressBar value={time} displayValueTemplate={timeTemplate}></ProgressBar>
                </div>
            </div>
        </div>
    )
}




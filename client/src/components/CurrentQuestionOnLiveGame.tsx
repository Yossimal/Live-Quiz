import { useEffect, useState } from 'react';
import { QuestionType, QuestionOptionType } from '../types/dataObjects';
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

    const timeTemplate = (value: number) => {
        return (
            <>
                {value}/<b>{question.time}</b>
            </>
        );
    };

    return (
        <div className='w-full shadow-2 border-round surface-card flex flex-column align-content-center justify-content-center'>
            <h1 className='text-center'>{question.question}</h1>
            <div className='grid'>
                {question.options?.map(opt => {
                    return (
                        <div key={opt.id} className='col-6'>
                            <Button
                                label={opt.data}
                                onClick={() => setSelectedOption(opt)}
                                className='text-center p-3 border-round-sm font-bold' />
                        </div>
                    )
                })}
            </div>
            <div className="card mt-6">
                <ProgressBar value={time} displayValueTemplate={timeTemplate} />
            </div>
        </div>
    )
}




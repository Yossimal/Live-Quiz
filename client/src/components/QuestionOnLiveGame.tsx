import { useEffect, useState } from 'react';
import { QuestionType, QuestionOptionType } from '../types/dataObjects';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Divider } from 'primereact/divider';

type Props = {
    question: QuestionType;
    onSelectedOption?: (option: QuestionOptionType) => void;
    time: number;
}

export default function QuestionOnLiveGame({ question, onSelectedOption, time }: Props) {
    const [selectedOption, setSelectedOption] = useState<QuestionOptionType>();
    const [isSelected, setIsSelected] = useState<boolean>(false);
    useEffect(() => {
        if (!selectedOption || !onSelectedOption)
            return;

        onSelectedOption(selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        setIsSelected(false);
    }, [question]);

    if (!question) return <></>;

    const timeTemplate = (value: number) => {
        return (
            <>
                ⏳ {Math.floor(value / 10)}/<b>{question.time}</b>
            </>
        );
    }

    const calcProgress = () => {
        return (time / question.time) * 100;
    }

    const getOptionIcon = (option: QuestionOptionType) => {
        if (time > 0) return undefined;
        return option.isCorrect ? 'pi pi-check' : 'pi pi-times';
    }

    const getColorAfterAnswer = (option: QuestionOptionType) => {
        if (time > 0) return undefined;
        return option.isCorrect ? 'bg-green-500' : 'bg-gray-900';
    }

    const getCorrectOptionAnimation = (option: QuestionOptionType) => {
        if (time > 0) return undefined;
        return option.isCorrect ? 'fadeout animation-duration-2000 animation-iteration-2' : '';
    }

    return (
        <div className='my-2 surface-50 p-5'>
            <pre style={{
                whiteSpace: 'pre-wrap',
            }} className='lg:text-2xl text-xl'>{question.question}</pre>
            <Divider />
            <div className='w-full flex flex-column justify-content-center align-items-center gap-3 mb-3'>
                {question.options?.map(opt => {
                    return (
                        <div key={opt.id} className={`border-round-sm font-bold w-full ${getCorrectOptionAnimation(opt)}`}>
                            <Button
                                label={opt.data}
                                className={`w-full ${getColorAfterAnswer(opt)}`}
                                disabled={isSelected || time <= 0}
                                icon={getOptionIcon(opt)}
                                onClick={() => {
                                    setSelectedOption(opt);
                                    setIsSelected(true);
                                }} />
                        </div>
                    )
                })}
            </div>
            <div className='card'>
                <ProgressBar
                    className=''
                    value={calcProgress()}
                    showValue={true}
                    displayValueTemplate={timeTemplate} ></ProgressBar>
            </div>
        </div>
    )
}




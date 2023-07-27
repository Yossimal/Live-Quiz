import { AnswerResultType, QuestionType } from "../../types/dataObjects";
import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { groupBy } from "../../common/objectsTools";

type Props = {
    results: AnswerResultType[];
    question: QuestionType;
}

// TODO
export default function AnswerResults({ results, question }: Props) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        const data = {
            labels: question.options?.map(opt => opt.data),
            datasets: [
                {
                    // group the options by their id and count them
                    data: groupBy(results.map(r => r.option), 'id'),
                    //TODO

                }]
        }
        const options = {
        }

        setChartData(data);
        setChartOptions(options);
    }, [results, question]);


    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    )
}
import { useParams } from "react-router-dom"
import { useQuery } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { QuizType, QuestionType } from "../../types/dataObjects";
import { ProgressBar } from 'primereact/progressbar';
import Error from "../../components/Error";


// function Question({ question }: { question: QuestionType }) {
//     return (



export default function SpecificQuiz() {
    const { id } = useParams<{ id: string }>();

    const { instance } = useAxios();

    const { data, isLoading, isError, error } = useQuery<QuizType>(["quiz", id], async () => {
        const { data } = await instance!.get<QuizType>(`/quiz/${id}`);
        return data;
    });

    if (isLoading) return (
        <div className="card flex align-items-center justify-content-center">
            <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
        </div>
    );

    if (isError) return <h1>error</h1>;  //<Error error={error} />

    if (!data) return <h1>no data</h1>;

    const quiz = data;
    return (
        <div className="flex flex-column align-items-center justify-content-center">
            <h1>{quiz.name}</h1>
            <p>{quiz.description}</p>
            <div>
                {quiz.questions?.map((question) => {
                    return (
                        <div key={question.id}>
                            <h1>{question.question}</h1>
                            <div>
                                {question.options?.map((option) => {
                                    return (
                                        <div key={option.id}>
                                            <p>{option.data}</p>
                                            <p>{option.isCorrect ? "correct" : "incorrect"}</p>
                                        </div>

                                    )
                                })}
                            </div>
                        </div>
                    )
                })
                }
            </div>
            <button>start</button>
        </div>
    )
}
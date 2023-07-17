import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { QuizType } from "../../types/dataObjects";
import { DataView } from 'primereact/dataview';
import { useEffect } from "react";
import { ProgressBar } from 'primereact/progressbar';
import Error from "../../components/Error";




export default function Quizzes() {
    const navigate = useNavigate();
    const { instance } = useAxios();

    useEffect(() => {
        if (!instance) navigate("/");;
    }, [instance])

    const { data, isLoading, isError, error } = useQuery<QuizType[]>("quizzes", async () => {
        console.log("fetching quizzes")
        console.log(instance)
        const { data } = await instance!.get<QuizType[]>("/quiz");
        return data;
    })

    if (isLoading) return (
        <div className="card flex align-items-center justify-content-center">
            <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
        </div>
    );

    if (isError) return <h1>error</h1>;  //<Error error={error} />

    if (!data) return <h1>no data</h1>

    return (
        <div className="ml-30">
            <h1>Quizzes</h1>
            <DataView value={data} itemTemplate={(quiz: QuizType) => {
                return (
                    <div>
                        <h1>{quiz.name}</h1>
                        <p>{quiz.description}</p>
                        <button onClick={() => navigate(`/home/quiz/${quiz.id}`)}>Show</button>
                    </div>
                )
            }}>
            </DataView>
        </div>
    )
}



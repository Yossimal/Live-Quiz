import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { QuizType } from "../../types/dataObjects";
import { DataView } from "primereact/dataview";
import { useEffect } from "react";
import { ProgressBar } from "primereact/progressbar";
import Error from "../../components/Error";
import QuizItem from "./QuizItem";

export default function MyQuizzes() {
  const navigate = useNavigate();
  const { instance } = useAxios();

  useEffect(() => {
    if (!instance) navigate("/");
  }, [instance]);

  const { data, isLoading, isError, error } = useQuery<QuizType[]>(
    ["my-quizzes"],
    async () => {
      const { data } = await instance!.get<QuizType[]>("/quiz");
      console.log(data);
      return data;
    }
  );

  if (isLoading)
    return (
      <div className="card flex align-items-center justify-content-center">
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
        ></ProgressBar>
      </div>
    );

  if (isError) return <h1>error</h1>; //<Error error={error} />

  if (!data) return <h1>no data</h1>;

  return (
    <>
      <div className="card">
        <h1>Quizzes</h1>
        <DataView
          value={data}
          itemTemplate={(quiz: QuizType) => {
            return <QuizItem quiz={quiz} />;
          }}
        />
      </div>

    </>
  );
}

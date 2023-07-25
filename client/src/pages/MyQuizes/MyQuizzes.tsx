import { useQuery } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { QuizType } from "../../types/dataObjects";
import { DataView } from "primereact/dataview";
import Error from "../../components/Error";
import Loader from "../../components/Loader"
import QuizItem from "./QuizItem";

export default function MyQuizzes() {
  const { instance } = useAxios();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-quizzes"],
    queryFn: async () => {
      const { data } = await instance!.get<QuizType[]>("/quiz");
      return data;
    }
  });

  if (isLoading) return <Loader />
  if (isError) return <Error error={error as Error} />
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

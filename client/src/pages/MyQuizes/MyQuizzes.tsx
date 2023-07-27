import { useQuery } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { QuizType } from "../../types/dataObjects";
import { DataView } from "primereact/dataview";
import Error from "../../components/Error";
import Loader from "../../components/Loader";
import QuizItem from "./QuizItem";
import { SERVER_URL } from "../../common/consts";

export default function MyQuizzes() {
  const { instance } = useAxios();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-quizzes"],
    queryFn: async () => {
      const { data } = await instance!.get<QuizType[]>("/quiz");
      const results = data.map((quiz) => {
        return {
          ...quiz,
          image: quiz.imageId
            ? `${SERVER_URL}/media/${quiz.imageId}`
            : undefined,
        };
      });
      return results;
    },
    staleTime: 1000 * 60 * 5, //set the query fresh for 5 minutes
  });

  if (isLoading) return <Loader />;
  if (isError) return <Error error={error as Error} />;
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

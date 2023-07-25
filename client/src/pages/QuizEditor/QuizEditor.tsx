import { useState } from "react";
import QuestionPanel from "./QuestionPanel";
import { Button } from "primereact/button";
import { addButton } from "../../common/styles";
import { useMutation, useQuery } from "react-query";
import { QuizType } from "../../types/dataObjects";
import { useParams } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { SaveQuestionRequest, SaveQuizRequest } from "../../types/api";
import { removeUndefined } from "../../common/objectsTools";

type GetQuizUpdateRequestProps = {
  id: number;
  name?: string;
  description?: string;
  image?: string;
  questionsToUpdate?: EdibleQuestionType[];
  questionsToDelete?: number[];
};

function getQuizUpdateRequest({
  id,
  name,
  description,
  image,
  questionsToUpdate,
  questionsToDelete,
}: GetQuizUpdateRequestProps): SaveQuizRequest {
  const questionsEdible: EdibleQuestionType[] = [
    ...(questionsToUpdate?.filter((q) => q.isChanged) ?? []),
    ...(questionsToDelete?.map((id) => ({
      id,
      isDeleted: true,
      isChanged: true,
    })) ?? []),
  ];

  const questionsEdibleUnique = questionsEdible.filter(
    (q, index, self) => self.findIndex((s) => s.id === q.id) === index
  );

  const questions: SaveQuestionRequest[] = questionsEdibleUnique.map((q) =>
    removeUndefined({
      id: q.id,
      media: q.media,
      options: q.options
        ?.filter((o) => o.isChanged)
        .map((o) => ({
          data: o.data,
          id: o.id,
          isCorrect: o.isCorrect,
        })),
      question: q.question,
      index: q.index,
      time: q.time,
      score: q.score,
      isDeleted: q.isDeleted,
    })
  );
  return {
    id,
    name,
    description,
    image,
    questions,
  };
}

export default function QuizEditor() {
  const [questions, setQuestions] = useState<EdibleQuestionType[]>([]);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [deletedQuestions, setDeletedQuestions] = useState<number[]>([]);
  const { id } = useParams();
  const axios = useAxios().instance;

  if (!error && (!id || !Number.isInteger(id))) {
    setError(
      "There is an error with the site url. Please don't change the url manually."
    );
  }

  const loadQuiz = (quiz: QuizType) => {
    setName(quiz.name);
    setDescription(quiz.description);
    setImage(quiz.image);
    const questionsFromServer = quiz.questions
      ?.map((q): EdibleQuestionType => {
        return {
          id: q.id,
          media: q.media,
          isChanged: false,
          options: q.options?.map(
            (o): OptionalQuestionOptionType => ({
              isChanged: false,
              data: o.data,
              id: o.id,
              isCorrect: o.isCorrect,
            })
          ),
          question: q.question,
          index: q.index,
          time: q.time,
        };
      })
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    setQuestions(questionsFromServer || []);
  };

  const quizQuery = useQuery<QuizType>({
    queryKey: ["my-quizzes", id],
    queryFn: async () => {
      if (!axios) {
        throw new Error("An unexpected error occured. try again later.");
      }
      console.log("fetching quiz");
      const { data } = await axios.get<QuizType>(`/quiz/${id}`);
      return data;
    },
    onError: () => {
      setError("An unexpected error occured. try again later.");
    },
    onSuccess: (data) => {
      if (!data) return;
      loadQuiz(data);
    },
  });

  const saveQuizMutation = useMutation({
    mutationKey: ["my-quizzes", id],
    mutationFn: async () => {
      if (!axios) {
        throw new Error("An unexpected error occured. try again later.");
      }
      const response = await axios.post<QuizType>(
        "/quiz/update",
        getQuizUpdateRequest({
          id: Number(id!), //the id is not undefined because of the error check above
          name,
          description,
          image,
          questionsToUpdate: questions,
          questionsToDelete: deletedQuestions,
        })
      );
      return response.data;
    },
    onSuccess(data) {
      setDeletedQuestions([]);
      if (!data) return;
      loadQuiz(data);
    },
  });

  const addQuestion = () => {
    const newQuestion: EdibleQuestionType = {
      id: new Date().getMilliseconds() * -1,
      isChanged: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const onDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (id >= 0) {
      setDeletedQuestions((prev) => [...prev, id]);
    }
  };

  const saveQuizz = () => {
    saveQuizMutation.mutate();
  };

  const questionsDOM = questions.map((question) => {
    const questionState: PartialState<EdibleQuestionType> = [
      question,
      (newQuestion: EdibleQuestionType) => {
        const index = questions.findIndex((q) => q.id === question.id);
        questions[index] = newQuestion;
        setQuestions([...questions]);
      },
    ];
    return (
      <QuestionPanel
        questionState={questionState}
        key={question.id}
        onDelete={onDelete}
      />
    );
  });

  if (quizQuery.isError) {
    return (
      <Message
        style={{
          border: "solid #696cff",
          borderWidth: "0 0 0 6px",
          color: "#696cff",
        }}
        className="border-primary w-full justify-content-start"
        severity="info"
        content={error}
      />
    );
  }
  if (quizQuery.isLoading) {
    return <ProgressSpinner />;
  }

  return (
    <>
      <h1>{quizQuery.data?.name}</h1>
      <div className="flex flex-column gap-2">
        {questionsDOM}
        <Button
          icon="pi pi-save"
          label="Save"
          rounded
          severity="success"
          onClick={saveQuizz}
        />
      </div>
      {/* add buttons for adding new question and saving at the buttom right corner*/}
      <Button
        icon="pi pi-plus"
        style={addButton}
        className="p-button-rounded bg-primary w-4rem h-4rem p-4 font-bold"
        onClick={addQuestion}
      />
    </>
  );
}

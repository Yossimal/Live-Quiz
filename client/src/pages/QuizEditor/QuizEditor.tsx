import { useRef, useState } from "react";
import QuestionPanel from "./QuestionPanel";
import { Button } from "primereact/button";
import { addButton } from "../../common/styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QuizType } from "../../types/dataObjects";
import { useParams } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { SaveQuestionRequest, SaveQuizRequest } from "../../types/api";
import { removeUndefined } from "../../common/objectsTools";
import { YEAR } from "../../common/consts";
import { Toast } from "primereact/toast";
import makePrivate from "../../router/makePrivate";

type GetQuizUpdateRequestProps = {
  id: number;
  name?: string;
  description?: string;
  image?: string;
  questionsToUpdate?: EdibleQuestionType[];
  questionsToDelete?: number[];
};

function cleanTempIds(questions: EdibleQuestionType[]) {
  return questions.map((q) => {
    q.options = q.options?.map((o) => {
      if (o.id && o.id < 0) {
        return removeUndefined({ ...o, id: undefined });
      }
      return o;
    });
    if (q.id < 0) {
      return removeUndefined({ ...q, id: undefined });
    }
    return q;
  });
}

function getQuizUpdateRequest({
  id,
  name,
  description,
  questionsToUpdate,
  questionsToDelete,
}: GetQuizUpdateRequestProps): SaveQuizRequest {
  console.log("1", questionsToUpdate)
  const cleanedQuestionsToUpdate = cleanTempIds(questionsToUpdate ?? []);
  console.log("2", cleanedQuestionsToUpdate)
  const questionsEdible: EdibleQuestionType[] = [
    ...(cleanedQuestionsToUpdate?.filter((q) => q.isChanged) ?? []),
    ...(questionsToDelete?.map((id) => ({
      id,
      isDeleted: true,
      isChanged: true,
    })) ?? []),
  ];
  console.log("3", questionsEdible)
  const questionsEdibleUnique = questionsEdible.filter(
    (q, index, self) => self.findIndex((s) => s.id === q.id) === index|| q.id==undefined
  );
  console.log("4", questionsEdibleUnique)

  const questions: SaveQuestionRequest[] = questionsEdibleUnique.map((q) =>
    removeUndefined({
      id: q.id,
      options: q.options
        ?.filter((o) => o.isChanged)
        .map((o) => ({
          data: o.data,
          id: o.id,
          isCorrect: o.isCorrect,
          isDeleted: o.isDeleted,
        })),
      question: q.question,
      index: q.index,
      time: q.time,
      score: q.score,
      isDeleted: q.isDeleted,
    })
  );
  console.log("5", questions)
  return {
    id,
    name,
    description,
    questions,
  };
}

function QuizEditor() {
  const [questions, setQuestions] = useState<EdibleQuestionType[]>([]);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [deletedQuestions, setDeletedQuestions] = useState<number[]>([]);
  const toast = useRef<Toast>(null);
  const { id } = useParams();
  const axios = useAxios().instance;
  const queryClient = useQueryClient();

  if (!error && (!id || !Number.isInteger(id))) {
    setError(
      "There is an error with the site url. Please don't change the url manually."
    );
  }

  const loadQuiz = (quiz: QuizType) => {
    setName(quiz.name);
    setDescription(quiz.description);
    setImage(quiz.image ?? "");
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
              isCorrect: o.isCorrect
            })
          ),
          question: q.question,
          index: q.index,
          time: q.time,
          score: q.score,
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
    staleTime: YEAR,
  });

  const saveQuizMutation = useMutation({
    mutationKey: ["my-quizzes", id],
    mutationFn: async () => {
      if (!axios) {
        throw new Error("An unexpected error occured. try again later.");
      }
      console.log(questions);
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
      queryClient.setQueryData(["my-quizzes", id], data);
      loadQuiz(data);
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Quiz Saved Succsessfully",
          life: 3000,
        });
      }
    },
  });

  const addQuestion = () => {
    const newQuestion: EdibleQuestionType = {
      id: new Date().getMilliseconds() * -1,
      isChanged: true,
      time: 10,
      index: questions.length,
      score: 100,
    };
    setQuestions([...questions, newQuestion]);
  };

  const onDelete = (id: number) => {
    console.log("deleting question", id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (id >= 0) {
      setDeletedQuestions((prev) => [...prev, id]);
      console.log("deleted questions", deletedQuestions);
    }
  };

  const saveQuizz = () => {
    saveQuizMutation.mutate();
  };

  const sortQuestions = (questions: EdibleQuestionType[]) => {
    return questions.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  };

  const moveQuestionUp = (id: number) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index > 0) {
      const newQuestions = [...questions];
      newQuestions[index].index = index - 1;
      newQuestions[index - 1].index = index;
      setQuestions(sortQuestions(newQuestions));
    }
  };

  const moveQuestionDown = (id: number) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      newQuestions[index].index = index + 1;
      newQuestions[index + 1].index = index;

      setQuestions(sortQuestions(newQuestions));
    }
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
        moveUp={moveQuestionUp}
        moveDown={moveQuestionDown}
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
    <div className="flex flex-column justify-content-center align-items-center">
      <Toast ref={toast} />
      <div className='text-4xl text-purple-600 font-bold mb-3'>Edit
        {<span className=" font-italic text-purple-400"> {quizQuery.data?.name} </span>} Quiz</div>
      <div className="gap-3 w-10">
        {questionsDOM}
        <Button
          icon="pi pi-save"
          label={saveQuizMutation.isLoading ? "...Saving" : "Save"}
          rounded
          severity="success"
          onClick={saveQuizz}
          disabled={saveQuizMutation.isLoading}
        />
      </div>
      <Button
        icon="pi pi-plus"
        style={addButton}
        className="p-button-rounded bg-primary w-4rem h-4rem p-4 font-bold"
        onClick={addQuestion}
        disabled={saveQuizMutation.isLoading}
      />
    </div>
  );
}

export default makePrivate(QuizEditor);

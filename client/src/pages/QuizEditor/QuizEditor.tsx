import { useState } from "react";
import QuestionPanel from "./QuestionPanel";
import { Button } from "primereact/button";
import { addButton } from "../../common/styles";

export default function QuizEditor() {
  const [questions, setQuestions] = useState<EdibleQuestionType[]>([]);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const addQuestion = () => {
    const newQuestion: EdibleQuestionType = {
      id: new Date().getMilliseconds(),
    };
    setQuestions([...questions, newQuestion]);
  };

  const onDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const saveQuizz = () => {};

  const questionsDOM = questions.map((question) => {
    const questionState: ArrayState<EdibleQuestionType> = [
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

  return (
    <>
      <h1>New Quiz</h1>
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
        className="p-button-rounded absolute bg-primary w-4rem h-4rem p-4 font-bold"
        onClick={addQuestion}
      />
    </>
  );
}

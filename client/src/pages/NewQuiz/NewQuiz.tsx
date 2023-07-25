import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useMutation } from "react-query";
import { CreateQuizRequest, CreateQuizResponse } from "../../types/api";
import { useAxios } from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

function validateResponse(data: any): data is CreateQuizResponse {
  return typeof data.id === "number";
}

export default function NewQuiz() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const axios = useAxios();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const createQuizMutation = useMutation({
    mutationKey: ["my-quizzes"],
    mutationFn: async (quiz: CreateQuizRequest) => {
      if (!axios.instance) {
        throw new Error("No axios instance");
      }
      const response = await axios.instance?.post<CreateQuizResponse>(
        "/quiz",
        quiz
      );
      if (!response) {
        throw new Error("No response");
      }
      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (!error.status || [400, 401, 402].includes(error.status)) {
          if (!toast.current) return;
          let errorMessage = "Something went wrong, try again later";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            life: errorMessage.length * 50,
          });
        }
      }
    },
    onSuccess: (data: CreateQuizResponse) => {
      if (validateResponse(data)) {
        navigate(`edit/${data.id}`);
      }
    },
  });

  const createQuiz = () => {
    const quiz: CreateQuizRequest = {
      name,
      description,
    };
    createQuizMutation.mutate(quiz);
  };

  const onLoading = <ProgressSpinner />;

  const formContent = (
    <>
      {" "}
      <div className="flex flex-column gap-2">
        <div className="flex flex-column gap-2">
          <InputText
            type="text"
            placeholder="Enter the quiz name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputTextarea
            rows={5}
            cols={30}
            autoResize
            placeholder="Enter the quiz description here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            icon="pi pi-save"
            label="Save"
            rounded
            severity="success"
            onClick={createQuiz}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Panel header="New Quiz">
        {createQuizMutation.isLoading ? onLoading : formContent}
      </Panel>
    </>
  );
}

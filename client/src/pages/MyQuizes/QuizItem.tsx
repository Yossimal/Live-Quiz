import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { useNavigate } from "react-router-dom";
import { QuizType } from "../../types/dataObjects";
import quizImgPlaceholder from "../../assets/quiz-placeholder.jpg";
import ChangeImageDialog from "./ChangeImageDialog";
import { useState } from "react";
import QuizImage from "./QuizImage";
import { useMutation } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { ProgressSpinner } from "primereact/progressspinner";

type QuizItemProps = {
  quiz: QuizType;
};

export default function QuizItem({ quiz }: QuizItemProps) {
  const navigate = useNavigate();
  const dialogVisible = useState(false);
  const instance = useAxios().instance;

  type ChangeImageMutationVariables = {
    quizId: number;
    file: File;
  };

  const handleChangeImageRequest = (quizId: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return instance!.post(`/media/quiz/${quizId}`, formData);
  };

  const changeImageMutation = useMutation({
    mutationFn: async ({ quizId, file }: ChangeImageMutationVariables) =>
      handleChangeImageRequest(quizId, file),
    mutationKey: ["my-quizzes", quiz.id],
  });

  const changeImage = async (file: File) => {
    const quizId = quiz.id;
    try {
      await changeImageMutation.mutateAsync({ quizId, file });
    } catch (error) {
      console.log(error);
    }
  };

  const imageDOM = changeImageMutation.isLoading ? (
    <ProgressSpinner />
  ) : (
    <QuizImage
      className="shadow-2 lg:w-3 md:w-4 border-round"
      src={quiz.image || quizImgPlaceholder}
      alt={quiz.name}
      icon="pi pi-pencil"
      size="200px"
      mdSize="150px"
      smSize="100px"
      onClick={() => dialogVisible[1](true)}
    />
  );

  return (
    <>
      <div className="col-12">
        <div className="flex flex-column lg:flex-row lg:align-items-center p-4 lg:gap-2">
          {imageDOM}
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center lg:align-items-start flex-1 gap-2">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{quiz.name}</div>
              <span className="flex align-items-center gap-2">
                <i className="pi pi-user"></i>
                <span className="font-semibold">
                  {quiz._count?.onlineGames || 0} Plays
                </span>
              </span>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-book"></i>
                  <span className="font-semibold">
                    {quiz._count?.questions || 0} Questions
                  </span>
                </span>
              </div>
            </div>
            <div className="card">
              <Fieldset legend="Description" toggleable>
                <p className="m-0">{quiz.description}</p>
              </Fieldset>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <Button
                tooltipOptions={{ position: "top" }}
                tooltip="Play Quiz"
                icon="pi pi-play"
                className="p-button-rounded"
                onClick={() => navigate(`/home/quiz/play/${quiz.id}`)}
              ></Button>
              <Button
                tooltipOptions={{ position: "bottom" }}
                tooltip="Edit Quiz"
                icon="pi pi-pencil"
                className="p-button-rounded"
                onClick={() => navigate(`/home/quiz/edit/${quiz.id}`)}
              ></Button>
            </div>
          </div>
        </div>
      </div>
      <ChangeImageDialog isVisible={dialogVisible} changeImage={changeImage} />
    </>
  );
}

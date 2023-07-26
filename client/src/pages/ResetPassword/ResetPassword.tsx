import { useRef, useState } from "react";
import CenterCard from "../../components/CenterCard";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import axios, { Axios, AxiosError } from "axios";
import { SERVER_URL } from "../../common/consts";
import { useMutation } from "react-query";
import ResetPasswordStart from "./ResetPasswordStart";
import { ProgressSpinner } from "primereact/progressspinner";
import ResetPasswordSucess from "./ResetPAsswordSucess";
import ResetPasswordFail from "./ResetPasswordFail";

type ResetPasswordRequestProps = {
  password: string;
  token: string;
};

function handleResetPasswordRequest({
  password,
  token,
}: ResetPasswordRequestProps) {
  return axios.post(`${SERVER_URL}/auth/resetPassword`, { token, password });
}

enum Status {
  START,
  SUCESS,
  FETAL_ERROR,
}

export default function ResetPassword() {
  const toast = useRef<Toast>(null);
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>(Status.START);
  const [error, setError] = useState<string>("");

  const resetPasswordMutation = useMutation({
    mutationFn: (req: ResetPasswordRequestProps) =>
      handleResetPasswordRequest(req),
    onSuccess: () => {
      setStatus(Status.SUCESS);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
        if (err.response?.data.error) {
          setError(err.response?.data.error);
        }
        if (err.response?.data.fetal) {
          setStatus(Status.FETAL_ERROR);
        }
      }
    },
  });

  const resetPassword = (newPassword: string) => {
    if(!token) {
        setError("You've got a broken link. Please request a new one.");
        setStatus(Status.FETAL_ERROR);
        return;
    }
    resetPasswordMutation.mutate({ password: newPassword, token });
  };

  const sendError = (message: string) => {
    if (!toast.current) return;
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };

  let DOM = (
    <ResetPasswordStart resetPassword={resetPassword} sendError={sendError} />
  );

  if (resetPasswordMutation.isLoading) {
    DOM = <ProgressSpinner />;
  } else if (status === Status.SUCESS) {
    DOM = <ResetPasswordSucess />;
  } else if (status === Status.FETAL_ERROR) {
    DOM = <ResetPasswordFail message={error} />;
  }

  return (
    <CenterCard>
      <Toast ref={toast} />
      {DOM}
    </CenterCard>
  );
}

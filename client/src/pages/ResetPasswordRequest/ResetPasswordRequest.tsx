import CenterCard from "../../components/CenterCard";
import axios, { AxiosError } from "axios";
import { SERVER_URL } from "../../common/consts";
import { useMutation } from "react-query";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import EmailSent from "./EmailSent";
import ResetPasswordRequestStart from "./ResetPasswordRequestStart";
import { ProgressSpinner } from "primereact/progressspinner";

async function resetEmailRequest(email: string) {
  return await axios.post(`${SERVER_URL}/auth/forgotPassword`, { email });
}

export default function ResetPasswordRequest() {
  const [sent, setSent] = useState(false);
  const toast = useRef<Toast>(null);

  const resetEmailMutation = useMutation({
    mutationFn: resetEmailRequest,
    onSuccess: () => {
      setSent(true);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (!toast.current) return;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response?.data.error,
          life: 5000,
        });
      }
    },
  });

  const onSubmit = async (email: string) => {
    resetEmailMutation.mutate(email);
  };

  let DOM = <ResetPasswordRequestStart onSubmit={onSubmit} />;
  if (resetEmailMutation.isLoading) {
    DOM = <ProgressSpinner />;
  } else if (sent) {
    DOM = <EmailSent />;
  }

  return (
    <>
      <Toast ref={toast} />
      <CenterCard>{DOM}</CenterCard>
    </>
  );
}

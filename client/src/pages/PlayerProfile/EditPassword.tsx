import { Button } from "primereact/button";
import EdibleInput from "./EdibleInput";
import { useMutation } from "react-query";
import { useAxios } from "../../hooks/useAxios";
import { useAuthenticate, useCredentials } from "../../hooks/authHooks";

type EditPasswordProps = {
  oldPasswordState: PartialState<string>;
  newPasswordState: PartialState<string>;
  newPasswordConfirmState: PartialState<string>;
  toast: any;
};

export default function EditPassword({
  oldPasswordState,
  newPasswordConfirmState,
  newPasswordState,
  toast,
}: EditPasswordProps) {
  const [oldPassword, setOldPassword] = oldPasswordState;
  const [newPassword, setNewPassword] = newPasswordState;
  const [newPasswordConfirm, setNewPasswordConfirm] = newPasswordConfirmState;
  const auth = useAuthenticate();
  const user = useCredentials();
  const axios = useAxios().instance;

  type ChangePasswordMutationVariables = {
    oldPassword: string;
    newPassword: string;
  };

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: ChangePasswordMutationVariables) => {
      if (!axios) return;
      const { data } = await axios.post("/auth/changePassword", {
        oldPassword,
        newPassword,
      });
      return data;
    },
    onSuccess: () => {
      if (!toast.current) return;
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed",
        life: 3000,
      });
      auth.login({ email: user!.email, password: newPassword });
    },
  });

  const editPassword = () => {
    if (newPassword !== newPasswordConfirm) {
      if (!toast.current) return;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }
    changePasswordMutation.mutate({ oldPassword, newPassword });
  };

  return (
    <>
      <EdibleInput
        id="oldPassword"
        label="Old Password"
        valueState={[oldPassword, setOldPassword]}
        isEdible={!changePasswordMutation.isLoading}
        type="password"
      />
      <EdibleInput
        id="newPassword"
        label="New Password"
        valueState={[newPassword, setNewPassword]}
        type="password"
        isEdible={!changePasswordMutation.isLoading}
      />
      <EdibleInput
        id="newPasswordConfirm"
        label="Confirm New Password"
        valueState={[newPasswordConfirm, setNewPasswordConfirm]}
        isEdible={!changePasswordMutation.isLoading}
        type="password"
      />
      <Button label="Save" onClick={editPassword} />
    </>
  );
}

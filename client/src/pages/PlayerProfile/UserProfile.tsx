import makePrivate from "../../router/makePrivate";
import { useAuthenticate, useCredentials } from "../../hooks/authHooks";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import EdibleInput from "./EdibleInput";
import { Button } from "primereact/button";
import EditPassword from "./EditPassword";
import { useAxios } from "../../hooks/useAxios";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

function UserProfile() {
  const user = useCredentials();
  const auth = useAuthenticate();
  const toast = useRef<Toast>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const firstName = useState<string>("");
  const lastName = useState<string>("");
  const email = useState<string>("");
  const [passwordEditable, setPasswordEditable] = useState<boolean>(false);
  const oldPassword = useState<string>("");
  const password = useState<string>("");
  const confirmPassword = useState<string>("");
  const axios = useAxios().instance;

  if (!user) {
    return <>error...</>;
  }

  type UpdateProfileMutationVariables = {
    firstName: string;
    lastName: string;
    email: string;
  };

  const updateProfileMutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
    }: UpdateProfileMutationVariables): Promise<
      Nullable<UpdateProfileMutationVariables>
    > => {
      if (!axios) return null;
      await axios.post("/auth/updateProfile", {
        firstName,
        lastName,
        email,
      });
      return { firstName, lastName, email };
    },
    onSuccess: (data: Nullable<UpdateProfileMutationVariables>) => {
      if (!data) {
        if (!toast.current) return;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
        });
        return;
      }
      const { firstName, lastName, email } = data;
      auth.updateData({ firstName, lastName, email });
      setIsEditable(false);
      if (!toast.current) return;
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Profile updated",
      });
    },
    onError: (err) => {
      if (!toast.current) return;
      if (err instanceof AxiosError) {
        if (err.response?.data?.error) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.response.data.error,
          });
          return;
        }
      }
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    if (!user) return;
    firstName[1](user.firstName);
    lastName[1](user.lastName);
    email[1](user.email);
  }, [user]);

  const save = () => {
    updateProfileMutation.mutate({
      firstName: firstName[0],
      lastName: lastName[0],
      email: email[0],
    });
  };
  return (
    <div className={`flex align-items-center justify-content-center`}>
      <Toast ref={toast} />
      <div className="surface-card p-5 mt-3 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <h1 className="text-900 text-3xl font-medium mb-3">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <div className="flex flex-column gap-2">
          <EdibleInput
            id="firstName"
            label="First Name"
            valueState={firstName}
            isEdible={isEditable}
          />
          <EdibleInput
            id="lastName"
            label="Last Name"
            valueState={lastName}
            isEdible={isEditable}
          />
          <EdibleInput
            id="email"
            label="Email"
            valueState={email}
            isEdible={isEditable}
          />
          <Button
            label={isEditable ? "Save" : "Edit"}
            onClick={() => {
              if (isEditable) {
                save();
              } else {
                setIsEditable(true);
              }
            }}
          />

          <Button
            label="Change Password"
            className="p-button-secondary"
            onClick={() => setPasswordEditable((prev) => !prev)}
          />
          {passwordEditable && (
            <EditPassword
              newPasswordConfirmState={confirmPassword}
              newPasswordState={password}
              oldPasswordState={oldPassword}
              toast={toast}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default makePrivate(UserProfile);

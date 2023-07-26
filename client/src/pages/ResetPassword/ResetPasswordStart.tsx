import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

type ResetPasswordProps = {
  resetPassword: FullFunciton<void, [string]>;
  sendError: FullFunciton<void, [string]>;
};

export default function ResetPasswordStart({
  resetPassword,
  sendError,
}: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = () => {
    //check if password contains at least 8 characters, numbers, uppercase and lowercase letters
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!passwordRegex.test(password)) {
      sendError(
        "Password must contain at least 8 characters, numbers, uppercase and lowercase letters"
      );
      return;
    }
    if (password !== confirmPassword) {
      sendError("Passwords do not match");
      return;
    }
    resetPassword(password);
  };

  return (
    <>
      <h1 className="text-900 text-3xl font-medium mb-3">Reset Password</h1>
      <label htmlFor="password" className="text-500 text-lg">
        New Password
      </label>
      <InputText
        id="password"
        type="password"
        placeholder="Password"
        className="w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="confirmPassword" className="text-500 text-lg">
        Confirm Password
      </label>
      <InputText
        id="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        className="w-full"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        label="Reset Password"
        className="w-full"
        onClick={handlePasswordReset}
      />
    </>
  );
}

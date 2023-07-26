import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

type ResetPasswordStartProps = {
  onSubmit: FullFunciton<void, [string]>;
};

export default function ResetPasswordRequestStart({
  onSubmit,
}: ResetPasswordStartProps) {
  const [email, setEmail] = useState("");
  return (
    <>
      <h1 className="text-900 text-3xl font-medium mb-3">Reset Password</h1>
      <p className="text-500 text-lg">
        Enter your email address and we will send you a link to reset your
        password.
      </p>
      <InputText
        id="email"
        type="email"
        placeholder="Email"
        className="w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        label="Reset Password"
        className="w-full"
        onClick={() => onSubmit(email)}
      />
    </>
  );
}

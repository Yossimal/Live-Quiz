import { Link } from "react-router-dom";

export default function ResetPasswordSucess() {
  return (
    <>
      <h1 className="text-900 text-3xl font-medium mb-3">Sucess!</h1>
      <p className="text-500 text-lg">
        Your password has been reset. You can now{" "}
        <Link to="/">login with your new password.</Link>
      </p>
    </>
  );
}

import { Link } from "react-router-dom";

export default function EmailSent() {
  return (
    <>
      <h1 className="text-900 text-3xl font-medium mb-3">Check Your Email</h1>
      <p className="text-500 text-lg">
        We have sent you a link to reset your password.
      </p>
      <Link to="/" className="text-500 text-lg">
        Go back to login
      </Link>
    </>
  );
}

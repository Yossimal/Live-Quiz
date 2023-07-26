import { Link } from "react-router-dom";

type ResetPasswordFailProps = {
    message:string;
}

export default function({message}:ResetPasswordFailProps) {
    return (
        <>
            <h1 className="text-900 text-3xl font-medium mb-3">Error!</h1>
            <p className="text-500 text-lg">
                {message}
            </p>
            <Link to="/resetPassword">Get new link.</Link>
        </>
    )
}
import { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useCredentials } from "../hooks/authHooks";

export default function makePrivate(Component: FC) {
  //return private component
  return function (props: any) {
    const user = useCredentials();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/", { replace: true });
      }
    }, [user]);

    return user ? <Component {...props} /> : <></>;
  };
}

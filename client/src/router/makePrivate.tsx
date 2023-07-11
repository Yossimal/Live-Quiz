import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCredentials } from "../hooks/authHooks";

type PrivateRouteProps = {
  children: React.ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const navigate = useNavigate();
  const user = useCredentials();
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  return children;
}

export default function makePrivate(node: React.ReactNode) {
  return <PrivateRoute>{node}</PrivateRoute>;
}

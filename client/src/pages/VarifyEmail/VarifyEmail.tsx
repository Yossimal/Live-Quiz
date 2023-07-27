import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../common/consts";

function validateEmail(token: string) {
  return axios.post(`${SERVER_URL}/auth/varifyEmail`, { token });
}

export default function VarifyEmail() {
  const params = useParams<{ token: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.token) return;
    validateEmail(params.token)
      .then((res) => {
        if (res.status === 200) navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <h1>VarifyEmail</h1>;
}

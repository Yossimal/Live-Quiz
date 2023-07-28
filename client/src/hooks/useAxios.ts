import axios, { AxiosInstance } from "axios";
import { useAuthenticate, useCredentials } from "./authHooks";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../common/consts";

export function useAxios(): { instance: AxiosInstance | null } {
  const user = useCredentials();
  const { refresh } = useAuthenticate();
  const navigate = useNavigate();

  if (!user) navigate('/');

  const instance = axios.create({
    baseURL: `${SERVER_URL}/api/`,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${user!.accessToken}`,
    },
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 403) {
        await refresh();
      }
      else {
        throw error;
      }
    }
  );
  return { instance };
}

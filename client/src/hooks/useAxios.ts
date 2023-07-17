import axios, { AxiosInstance } from "axios";
import { useAuthenticate, useCredentials } from "./authHooks";

export function useAxios(): { instance: AxiosInstance | null } {
  const user = useCredentials();
  const { refresh } = useAuthenticate();

  if (!user) return { instance: null };

  //if (instance) return { instance };
  const instance = axios.create({
    baseURL: "http://localhost:3000/api/",
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
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
    }
  );
  //setInstance(_instance);
  return { instance };
}

import axios, { AxiosInstance } from "axios";
import { useAuthenticate, useCredentials } from "./authHooks";
import { useState } from "react";

export function useAxios() {
  const user = useCredentials();
  const { refresh } = useAuthenticate();
  const [instance, setInstance] = useState<AxiosInstance | null>(null);
  console.log("current user", user);

  if (!user) return { instance: null };

  if (instance) return { instance };
  const _instance = axios.create({
    baseURL: "http://localhost:3000/api/",
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });
  _instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 403) {
        await refresh();
      }
    }
  );
  setInstance(_instance);
  return { instance };
}

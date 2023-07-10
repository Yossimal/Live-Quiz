import axios, { AxiosInstance } from "axios";
import { useAuth } from "./useAuth";
import { useState } from "react";

export function useAxios() {
  const { currentUser, refresh } = useAuth()!;
  const [instance, setInstance] = useState<AxiosInstance | null>(null);
  console.log("current user", currentUser);
  if (instance) return { instance };
  const _instance = axios.create({
    baseURL: "http://localhost:3000/api/",
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${currentUser?.accessToken}`,
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

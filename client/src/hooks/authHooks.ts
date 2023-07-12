import { useSession } from "./useSession";
import userSerializer from "../data/serialization/userSerializer";
import { UserType } from "../types/dataObjects";
import axios, { Axios, AxiosError, AxiosInstance } from "axios";
import { LoginMutation, SingupData } from "../types/auth";
import { LoginResponse } from "../types/api";

const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/auth/",
  timeout: 10000,
});

export function useCredentials(): UserType | null {
  const [user, _] = useSession<UserType | null>("user", null, userSerializer);
  return user;
}

export function useAuthenticate() {
  const [user, setUser] = useSession<UserType | null>(
    "user",
    null,
    userSerializer
  );

  const login = async (loginData: LoginMutation): Promise<string> => {
    try {
      const res = await authAxiosInstance.post("/login", loginData);
      if (res.status !== 200) {
        const error = res.data.error;
        return error;
      }
      const user = res.data as LoginResponse;
      if (user) {
        const newUser: UserType = {
          ...user.user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
        setUser(newUser);
        console.log("Good login", user);
        return "";
      }
      return "An unexpected error occured";
    } catch (err) {
      if (err instanceof AxiosError
        && err.response?.data?.error) {
        const error = err.response.data.error;
        return error;
      }
      return "An unexpected error occured";
    }
  };

  const signup = async (signupData: SingupData): Promise<string> => {
    try {
      const res = await authAxiosInstance.post("/signup", signupData);
      if (res.status !== 200) {
        const error = res.data.error;
        return error;
      }
      const user = res.data as UserType;
      if (user) {
        //we not setting the user now because he need to verify his email
        console.log("Good signup", user);
        return "";
      }
      return "An unexpected error occured";
    } catch (err) {
      return "An unexpected error occured";
    }
  };

  const logout = async (): Promise<string> => {
    if (!user) return "";
    try {
      const res = await authAxiosInstance.post("/logout", {
        refreshToken: user.refreshToken,
        accessToken: user.accessToken,
      });
      if (res.status !== 204) {
        const error = res.data.error;
        return error;
      }
      setUser(null);
      return "";
    } catch (err) {
      return "An unexpected error occured";
    }
  };

  const refresh = async (): Promise<void> => {
    if (!user) return;
    const res = await authAxiosInstance.post("/token", {
      token: user.refreshToken,
    });
    if (res.status !== 200) {
      const error = res.data.error;
      throw new Error(error);
    }
    const newUser: UserType = {
      ...user,
      accessToken: res.data.accessToken,
    };

    if (newUser) {
      setUser(newUser);
      console.log("Good refresh", newUser);
      return;
    }
    throw new Error("An unexpected error occured");
  };

  return { login, signup, logout, refresh };
}

export function useLogin() {
  const authSession = useSession<UserType | null>("user", null, userSerializer);

  return authSession;
}

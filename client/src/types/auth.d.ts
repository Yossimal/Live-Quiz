import { UserType } from "./dataObjects";

export type CurrentUser = {
  user: UserType;
  accessToken: string;
  refreshToken: string;
};

export type LoginMutation = {
  email: string;
  password: string;
};

export type SingupData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: Date;
};


export type LoginResponse = {
  user: Pick<
    UserType,
    "id" | "firstName" | "lastName" | "email" | "birthday" | "role"
  >;
  accessToken: string;
  refreshToken: string;
};

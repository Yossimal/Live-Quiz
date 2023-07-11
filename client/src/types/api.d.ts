export type LoginResponse = {
  user: Pick<
    UserType,
    "id" | "firstName" | "lastName" | "email" | "birthDate" | "role"
  >;
  accessToken: string;
  refreshToken: string;
};

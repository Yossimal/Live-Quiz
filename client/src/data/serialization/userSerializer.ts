import { UserType } from "../../types/dataObjects";
import { Serializiation } from "../../types/serialization";

function isUserType(user: unknown): user is UserType {
  const userParams = [
    "id",
    "firstName",
    "lastName",
    "email",
    "birthday",
    "accessToken",
    "refreshToken",
    "role",
  ];
  if (!user || typeof user !== "object") {
    return false;
  }

  return userParams.every((param) => param in user);
}

function serializeUser(user: UserType | null): unknown {
  if (!user) return null;

  return {
    ...user,
  };
}

function deserializeUser(user: unknown): UserType | null {
  if (!user) return null;
  if (!isUserType(user)) {
    throw new Error("Invalid user type");
  }
  return {
    ...user,
  };
}

const userSerializer: Serializiation<UserType | null> = [
  serializeUser,
  deserializeUser,
];
export default userSerializer;

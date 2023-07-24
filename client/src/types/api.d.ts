export type LoginResponse = {
  user: Pick<
    UserType,
    "id" | "firstName" | "lastName" | "email" | "birthday" | "role"
  >;
  accessToken: string;
  refreshToken: string;
};

export type SaveQuestionOptionRequest = {
  isNew: boolean;
  id?: number;
  data?: string;
  isCorrect?: boolean;  
};

export type SaveQuestionRequest = {
  isNew: boolean;
  id?: number;
  index?: number;
  question?: string;
  media?: string;
  options?: SaveQuestionOptionRequest[];
}

export type SaveQuizRequest = {
  isNew: boolean;
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  questions?: SaveQuestionRequest[];
};
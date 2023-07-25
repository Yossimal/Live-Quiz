export type LoginResponse = {
  user: Pick<
    UserType,
    "id" | "firstName" | "lastName" | "email" | "birthday" | "role"
  >;
  accessToken: string;
  refreshToken: string;
};

export type SaveQuestionOptionRequest = {
  id?: number;
  data?: string;
  isCorrect?: boolean;  
};

export type SaveQuestionRequest = {
  id?: number;
  index?: number;
  question?: string;
  media?: string;
  time?: number;
  scpre: number;
  options?: SaveQuestionOptionRequest[];
}

export type SaveQuizRequest = {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  questions?: SaveQuestionRequest[];
};

export type CreateQuizRequest = {
  name: string;
  description: string;
  image?: string;
}

export type CreateQuizResponse = {
  id: number;
}
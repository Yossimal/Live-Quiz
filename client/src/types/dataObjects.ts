export enum Role {
  ADMIN = "Admin",
  USER = "User",
}

export enum MediaType {
  IMAGE = "Image",
  VIDEO = "Video",
  NONE = "None",
}

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  accessToken: string;
  refreshToken: string;
  role: Role;
};

export type QuestionOptionType = {
  id: number;
  data: string;
  questionId: number;
  isCorrect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
};

export type QuestionType = {
  id: number;
  question: string;
  quizId: number;
  options?: QuestionOptionType[];
  quiz?: QuizType;
  mediaType: MediaType;
  media: string;
  createdAt: Date;
  updatedAt: Date;
  index: number;
  time: number;
  score: number;
  mediaId: number | null;
};

export type QuizType = {
  id: number;
  name: string;
  description: string;
  imageId?: number | null;
  image?: string;
  questions?: QuestionType[];
  creatorId: number;
  //creator?: UserType;
  onlineGames?: OnlineGameType[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    questions: number;
    onlineGames: number;
  };
};

export type GameData = {
  id: number;
  name: string;
  description: string;
  questionsCount: number;
  totalTime: number;
}

export type OnlineGameType = {
  id: number;
  gameId: number;
  game?: QuizType;
  players?: PlayerType[];
};

export type PlayerType = {
  id: string;
  score: number;
  gameId: number;
  game?: QuizType;
  gameName: string;
  name: string;
};


export type TimeStampType = {
  createdAt: Date;
  updatedAt: Date;
};


export type AnswerResultType = {
  playerId: string;
  questionId: number;
  option: QuestionOptionType;
  isRight: boolean;
  score: number;
}

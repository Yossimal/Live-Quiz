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
  question?: QuestionType;
};

export type QuestionType = {
  id: number;
  data: string;
  gameId: number;
  options?: QuestionOptionType[];
  game?: GameType;
  mediaType: MediaType;
  mediaUrl: string;
};

export type GameType = {
  id: number;
  name: string;
  description: string;
  image: string;
  questions?: QuestionType[];
  creatorId: number;
  creator?: UserType;
  onlineGames?: OnlineGameType[];
};

export type OnlineGameType = {
  id: number;
  gameId: number;
  game?: GameType;
  players?: PlayerType[];
};

export type PlayerType = {
  id: number;
  score: number;
  gameId: number;
  game?: GameType;
};

export type TimeStampType = {
  createdAt: Date;
  updatedAt: Date;
};

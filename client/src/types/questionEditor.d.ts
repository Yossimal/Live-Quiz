type OptionalQuestionOptionType = {
  isChanged: boolean;
  id?: number;
  data?: string;
  isCorrect?: boolean;
};

type EdibleQuestionType = {
  id: number;
  isChanged: boolean;
  question?: string;
  quizId?: number;
  options?: OptionalQuestionOptionType[];
  quiz?: OptionalQuizType;
  media?: string;
  errors?: string;
  index?: number;
  time?: number;
  score?: number;
  isDeleted?: boolean;
};

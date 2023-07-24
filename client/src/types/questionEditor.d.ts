type OptionalQuestionOptionType = {
  id?: number;
  data?: string;
  isCorrect?: boolean;
};

type EdibleQuestionType = {
  id: number;
  question?: string;
  quizId?: number;
  options?: OptionalQuestionOptionType[];
  quiz?: OptionalQuizType;
  media?: string;
  errors?: string;
};

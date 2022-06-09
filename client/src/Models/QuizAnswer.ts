export interface QuizAnswer {
  answerid?: number;
  questionid?: number;
  answer: string;
  correctanswer?: number;
}

export interface AnswerOption {
  answer: string;
  correctanswer: number;
}


export interface CorrectResponses {
  questionid: number;
  correct_responses: number;
  wrong_responses: number;
  questiontheme: string;
}

export interface MostPickedIncorrectAnswer {
  questionid: number;
  questiontheme: string;
  answerid: number;
  answer: string;
  picks: number;
  pick_rate: number;
  correct_responses: number;
  wrong_responses: number;
  performance: number;
  first_option: number;
  options: number;
}

export interface LongestTimeSpent {
  questionid: number;
  average_response_time: string;
  time: number;
  questionsOverThreshold: number;
}

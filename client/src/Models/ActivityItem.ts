// TODO: Rename and split into two interfaces, one for fields corresponding to tables `quiz_question` and `statistics`
// Rename to corresponding table name
export interface ActivityItem {
  // Quiz_question
  questionid?: number;
  questinact?: number;
  questiontype?: number;
  questioncategory: number;
  categoryname?: string;
  questiondifficulty: number;
  questiontheme: string;
  questionavailable?: number;
  image?: string;
  fixed?: number;
  activityid?: number;
  inallactivities?: number;
  probzA?: number;
  probzB?: number;
  probzC?: number;
  diff?: number;
  monades?: number;
  RTE_threshold?: number;
  // Statistics:
  correct_responses?: number;
  wrong_responses?: number;
  effort_put?: number;
  effort?: number;
  performance?: number;
  avg_time?: string;
}

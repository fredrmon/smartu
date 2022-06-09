export interface TopicMastery {
  userid: number;
  name: string;
  questioncategory: number;
  categoryname: string;
  score: number;
}

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

export interface ActivityOverview {
  score: number;
  userid: number;
}

export interface CategoryOverview {
  total: number;
  categoryname: string;
}

export type TabContentProps = {
  data: any;
  options: any;
  tab: number;
};

export type DifficultyDistribution = {
  activityid: number;
  categoryid: number;
  categoryname: string;
  easy: number;
  medium: number;
  hard: number;
};

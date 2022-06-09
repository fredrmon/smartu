export interface Activity {
  activityid: number;
  activityname: string;
  activitystatus: number;
  activitydescription: string;
  activitycreator: number;
  levellow: number;
  levelhigh: number;
  adaptive_instruction: string;
  fixed_instruction: string;
  phasetwobegindate: string;
  phasetwoenddate: string;
  startDate: number;
  endDate: number;
  archived: string;
}

export interface StudentNotification {
  activityid: number;
  score: number;
}

export interface PickRateNotification {
  activityid: number;
  pick_rate: number;
}

export interface MostIncorrectNotification {
  activityid: number;
  performance: number;
}


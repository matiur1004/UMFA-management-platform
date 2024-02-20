export class DocumentStatusViewModel {
  logs: HistoryViewModel[];
  isComplete: boolean;
}

export class HistoryViewModel {
  id: string;
  comment: string;
  modifyDate: Date;
  startDate: Date;
  userFullName: string;
  isActualVersion: boolean;
  version: string;
  // local property base on startDate  YYYYMMDD
  versionDay?: string;
}

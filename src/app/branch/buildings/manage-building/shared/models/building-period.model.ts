export interface BuildingPeriodViewModel {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  linkedBuildingPeriodIds: string[];
  clientStatementName: string;
  isFinalized: boolean;
}

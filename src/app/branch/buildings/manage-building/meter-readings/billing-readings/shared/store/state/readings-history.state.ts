import {
  GroupedReadingsByBuildingPeriodViewModel,
  MeterViewModel,
  ReadingsHistoryViewModel,
  SORT_BY
} from '../../models/readings-history.model';
import {TimeOfUse} from '@models';

export interface State {
  groupsOfReadings: GroupedReadingsByBuildingPeriodViewModel[];
  pinnedReadings: ReadingsHistoryViewModel[];
  meterId: string;
  registerId: string;
  sortBy: SORT_BY;
  timeOfUse: TimeOfUse | null;
  startDate: Date;
  endDate: Date;
  meters: MeterViewModel[];
  totalReadingsAmount: number;
  page: number;
  unitsPerPage: number;
}

export const initialState: State = {
  groupsOfReadings: [],
  pinnedReadings: [],
  meterId: null,
  registerId: null,
  timeOfUse: null,
  startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  endDate: new Date(),
  sortBy: 0,
  meters: [],
  totalReadingsAmount: 0,
  page: 1,
  unitsPerPage: 30,
};

export const getReadings = (state: State) => state.groupsOfReadings;
export const getPinnedReadings = (state: State) => state.pinnedReadings;
export const getMeterId = (state: State) => state.meterId;
export const getRegisterId = (state: State) => state.registerId;
export const getSortBy = (state: State) => state.sortBy;
export const getTimeOfUse = (state: State) => state.timeOfUse;
export const getStartDate = (state: State) => state.startDate;
export const getEndDate = (state: State) => state.endDate;
export const getMeters = (state: State) => state.meters;
export const getReadingsAmount = (state: State) => state.totalReadingsAmount;
export const getTake = (state: State) => state.page + state.unitsPerPage;
export const getSkip = (state: State) => (state.page - 1) * state.unitsPerPage;

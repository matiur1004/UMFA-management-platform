import {BuildingPeriodViewModel} from '../../../../../shared/models/building-period.model';
import * as buildingPeriodsAction from '../actions/building-periods.actions';
import {EditDialogModeEnum} from '../../models/edit-dialog-mode.enum';

export interface State {
  buildingPeriods: BuildingPeriodViewModel[],
  buildingPeriodReferences: any[],
  periodsTotal: number,
  page: number,
  pageSize: number,
  searchFilter: string,
  editDialogMode: EditDialogModeEnum
}

export const initialState: State = {
  buildingPeriods: [],
  buildingPeriodReferences: [],
  periodsTotal: 0,
  page: 0,
  pageSize: 30,
  searchFilter: '',
  editDialogMode: null
}

export function reducer(state = initialState, action: buildingPeriodsAction.Action) {
  switch (action.type) {
    case buildingPeriodsAction.SET_EDIT_DIALOG_MODE: {
      return {
        ...state,
        editDialogMode: action.payload
      };
    }
    case buildingPeriodsAction.SET_PAGE: {
      return {
        ...state,
        page: action.payload
      };
    }
    case buildingPeriodsAction.SET_SEARCH_FILTER: {
      return {
        ...state,
        searchFilter: action.payload,
        page: 0
      };
    }
    case buildingPeriodsAction.SET_PAGE_SIZE: {
      return {
        ...state,
        pageSize: action.payload,
        page: 0
      };
    }
    case buildingPeriodsAction.BUILDING_PERIODS_LOADED: {
      return {
        ...state,
        buildingPeriods: action.payload.buildingPeriods,
        periodsTotal: action.payload.total
      };
    }
    case buildingPeriodsAction.BUILDING_PERIOD_REFERENCES_LOADED: {
      return {
        ...state,
        buildingPeriodReferences: action.payload
      };
    }
    default:
      return state;
  }
}

export const getBuildingPeriods = (state: State) => state.buildingPeriods;
export const getBuildingPeriodReferences = (state: State) => state.buildingPeriodReferences;
export const getBuildingPeriodsTotal = (state: State) => state.periodsTotal;
export const getPage = (state: State) => state.page;
export const getPageSize = (state: State) => state.pageSize;
export const getEditDialogMode = (state: State) => state.editDialogMode;

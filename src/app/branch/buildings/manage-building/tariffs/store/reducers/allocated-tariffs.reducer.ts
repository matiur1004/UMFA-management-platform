import * as fromActions from '../actions/allocated-tariffs.actions';
import {BuildingHistoryViewModel} from '../../../shared/models';
import {AggregatedBuildingTariffViewModel, BuildingDetailViewModel, TariffListOrder} from '@models';

export interface State {
  entities: AggregatedBuildingTariffViewModel[];
  filteredEntities: AggregatedBuildingTariffViewModel[];
  order: TariffListOrder;
  errors: any;
  supplyTypeFilter: number;
  supplierFilter: string;
  buildingData: BuildingDetailViewModel;
  buildingHistories: BuildingHistoryViewModel;
}

export const initialState: State = {
  entities: [],
  filteredEntities: [],
  order: TariffListOrder.NameAsc,
  errors: null,
  supplyTypeFilter: null,
  supplierFilter: '',
  buildingData: null,
  buildingHistories: null
};

export function reducer(state = initialState, action: fromActions.AllocatedBuildingTariffsActions) {
  switch (action.type) {
    // GET building data
    case fromActions.GET_BUILDING_DATA:
      return {
        ...state,
        errors: {...state.errors, buildingsData: null}
      };

    case fromActions.GET_BUILDING_DATA_SUCCESS:
      return {
        ...state,
        buildingData: action.payload,
      };

    case fromActions.GET_BUILDING_DATA_FAILED:
      return {
        ...state,
        errors: {...state.errors, buildingsData: action.payload}
      };

    // GET building history
    case fromActions.GET_BUILDING_HISTORY:
      return {
        ...state,
        errors: {...state.errors, buildingHistory: null}
      };

    case fromActions.GET_BUILDING_HISTORY_SUCCESS:
      return {
        ...state,
        buildingHistories: action.payload,
      };

    case fromActions.GET_BUILDING_HISTORY_FAILED:
      return {
        ...state,
        errors: {...state.errors, buildingHistory: action.payload}
      };

    // GET allocated building tariffs
    case fromActions.GET_ALLOCATED_BUILDING_TARIFFS:
      return {
        ...state,
        errors: {...state.errors, buildingTariffs: null}
      };

    case fromActions.GET_ALLOCATED_BUILDING_TARIFFS_SUCCESS:
      return {
        ...state,
        entities: action.payload,
        filteredEntities: action.payload,
      };

    case fromActions.GET_ALLOCATED_BUILDING_TARIFFS_FAILED:
      return {
        ...state,
        errors: {...state.errors, buildingTariffs: action.payload}
      };

    // UPDATE
    case fromActions.UPDATE_ALLOCATED_BUILDING_TARIFFS:
      return {
        ...state,
        filteredEntities: action.payload,
      };

    // SET
    case fromActions.SET_ALLOCATED_BUILDING_TARIFFS_ORDER:
      return {
        ...state,
        order: action.payload,
      };

    case fromActions.SET_ALLOCATED_BUILDING_TARIFFS_BY_SUPPLY_FILTER:
      return {
        ...state,
        supplierFilter: action.payload.supplierId,
        supplyTypeFilter: action.payload.supplyType
      };

    default:
      return state;
  }
}

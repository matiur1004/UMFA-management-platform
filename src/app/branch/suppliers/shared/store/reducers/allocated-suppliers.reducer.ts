import * as fromActions from '../actions';
import {SupplierBranchViewModel} from '../../models/supplier-branch-view.model';

export interface State {
  entities: SupplierBranchViewModel[];
  suppliersList: SupplierBranchViewModel[];
  order: number;
  pending: boolean;
  error: any;
  filter: number;
  branchId: string;
}

export const initialState: State = {
  entities: [],
  suppliersList: [],
  order: 1,
  pending: false,
  error: null,
  filter: null,
  branchId: null
}

export function reducer(state = initialState, action: fromActions.Actions) {
  switch (action.type) {
    // GET
    case fromActions.GET_ALLOCATED_SUPPLIERS:
      return {
        ...state,
        pending: true,
        error: null
      };

    case fromActions.GET_ALLOCATED_SUPPLIERS_SUCCESS:
      return {
        ...state,
        entities: action.payload,
        suppliersList: action.payload,
        pending: false
      };

    case fromActions.GET_ALLOCATED_SUPPLIERS_FAILED:
      return {
        ...state,
        pending: false,
        error: action.payload
      };

    // UPDATE
    case fromActions.UPDATE_ALLOCATED_SUPPLIERS:
      return {
        ...state,
        suppliersList: action.payload,
      };

    // SET
    case fromActions.SET_ALLOCATED_SUPPLIERS_ORDER:
      return {
        ...state,
        order: action.payload,
      };

    case fromActions.SET_ALLOCATED_SUPPLIERS_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case fromActions.SET_BRANCH_ID:
      return {
        ...state,
        branchId: action.payload,
      };

    // Clear
    case fromActions.PURGE_ALLOCATED_SUPPLIERS_STORE:
      return initialState;

    default:
      return state;
  }
}

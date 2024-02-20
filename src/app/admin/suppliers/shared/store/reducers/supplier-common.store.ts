import * as supplierCommonActions from '../actions/supplier-common.actions'
import {SupplierViewModel, SupplyType} from '@models';

export interface State {
  searchText: string;
  supplyType: SupplyType;
  suppliersList: SupplierViewModel[];
  addNewModal: any;
  sortOrder: number;
}

export const initialState: State = {
  searchText: '',
  supplyType: null,
  suppliersList: [],
  addNewModal: null,
  sortOrder: 1
};

export function reducer(state = initialState, action: supplierCommonActions.Action) {
  switch (action.type) {

    case supplierCommonActions.SUPPLIER_FILTER_TEXT_CHANGED: {
      return {
        ...state,
        searchText: action.payload
      };
    }
    case supplierCommonActions.SUPPLIER_FILTER_SUPPLY_TYPE_CHANGED: {
      return {
        ...state,
        supplyType: action.payload
      };
    }
    case supplierCommonActions.API_SUPPLIERS_LIST_LOADED: {
      return {
        ...state,
        suppliersList: action.payload
      };
    }
    case supplierCommonActions.API_SUPPLIER_LOADED: {
      return {
        ...state,
        supplier: action.payload
      };
    }
    case supplierCommonActions.SUPPLIER_ADD_NEW_MODAL_CHANGED: {
      return {
        ...state,
        addNewModal: action.payload
      };
    }
    case supplierCommonActions.SUPPLIERS_LIST_ORDER_CHANGED: {
      let sortOrder = state.sortOrder;

      if (sortOrder == action.payload || (sortOrder == (action.payload * -1)))
        sortOrder *= -1;
      else
        sortOrder = action.payload;

      return {
        ...state,
        sortOrder: sortOrder
      }
    }
    default:
      return state;
  }
}

import {SupplierViewModel, TariffCategoryViewModel} from '@models';
import * as supplierCommonActions from '../actions/supplier-common.actions';

export interface State {
  supplier: SupplierViewModel;
  tariffCategories: TariffCategoryViewModel[];
}

export const initialState: State = {
  supplier: null,
  tariffCategories: []
};

export function reducer(state = initialState, action: supplierCommonActions.Action) {
  switch (action.type) {

    case supplierCommonActions.API_SUPPLIER_LOADED: {
      return {
        ...state,
        supplier: action.payload
      };
    }
    case supplierCommonActions.API_SUPPLIER_GET_TARIFF_CATEGORIES_SUCCEEDED:
      return {
        ...state,
        tariffCategories: action.payload.tariffCategories
      }
    default:
      return state;
  }
}

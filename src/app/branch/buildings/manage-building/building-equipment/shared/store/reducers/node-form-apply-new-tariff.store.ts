import * as nodeFormAllocatedTariffActions from '../actions/node-form-allocated-tariffs.actions';
import {GroupedTariffViewModel} from '../../models/node-allocated-tariff.model';
import {SupplierViewModel} from '@models';

export interface State {
  tariffs: GroupedTariffViewModel[];
  suppliers: SupplierViewModel[];
  tariffVersionId: string;
  supplierId: string;
}

export const initialState: State = {
  tariffs: [],
  suppliers: [],
  tariffVersionId: null,
  supplierId: null
};

export function reducer(state = initialState, action: nodeFormAllocatedTariffActions.Action) {
  switch (action.type) {

    case nodeFormAllocatedTariffActions.SET_TARIFFS_FOR_APPLYING: {
      return {
        ...state,
        tariffs: action.payload.tariffs,
        suppliers: action.payload.suppliers,
        supplierId: action.payload.supplierId,
        tariffVersionId: action.payload.tariffVersionId
      };
    }

    case nodeFormAllocatedTariffActions.SELECT_SUPPLIER: {
      return {
        ...state,
        supplierId: action.payload
      };
    }

    case nodeFormAllocatedTariffActions.SELECT_TARIFF_VERSION: {
      return {
        ...state,
        tariffVersionId: action.payload
      };
    }

    default:
      return state;
  }
}

export const getTariffs = (state: State) => state.tariffs;
export const getSuppliers = (state: State) => state.suppliers;
export const getTariffVersionId = (state: State) => state.tariffVersionId;
export const getSupplierId = (state: State) => state.supplierId;

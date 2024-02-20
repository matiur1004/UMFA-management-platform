import * as fromActions from '../actions/additional-charges.actions';
import {ChargesListOrder, ChargeViewModel} from '../../../shared/models';
import {getSortValue} from '@shared-helpers';


export interface State {
  charges: ChargeViewModel[];
  order: ChargesListOrder;
}

export const initialState: State = {
  charges: null,
  order: ChargesListOrder.NameAsc
};

export function reducer(state = initialState, action: fromActions.BuildingAdditionalChargesActions) {
  switch (action.type) {
    // GET additional charges
    case fromActions.GET_BUILDING_ADDITIONAL_CHARGES_SUCCESS:
      return {
        ...state,
        charges: action.payload
      };

    case fromActions.UPDATE_ADDITIONAL_CHARGES:
      return {
        ...state,
        charges: action.payload
      };

    case fromActions.SET_ADDITIONAL_CHARGE_ORDER:
      return {
        ...state,
        order: getSortValue(state.order, action.payload)
      };

    // Clear
    case fromActions.PURGE_BUILDING_ADDITIONAL_CHARGES_STORE:
      return initialState;

    default:
      return state;
  }
}

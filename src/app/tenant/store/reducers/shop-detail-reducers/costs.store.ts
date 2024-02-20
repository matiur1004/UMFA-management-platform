import * as costsActions from '../../actions/shop-detail-actions/costs.actions';
import {ShopCostsViewModel} from '../../../profiles/models/shop-detail.model';

export interface State {
  costs: ShopCostsViewModel;
}

export const initialState: State = {
  costs: null
};

export function reducer(state = initialState, action: costsActions.Actions) {
  switch (action.type) {
    case costsActions.GET_COSTS_REQUEST_COMPLETE: {
      return {
        ...state,
        costs: action.payload
      };
    }

    default:
      return state;
  }
}

export const getCosts = (state: State) => state.costs;

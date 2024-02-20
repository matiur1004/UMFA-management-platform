import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromPortfolios from './portfolio.store';
import * as fromBuilding from './building-details.store';
import * as fromSplitShopForm from './split-shop-form.store';

export interface State {
  portfolios: fromPortfolios.State;
  building: fromBuilding.State;
  splitShopForm: fromSplitShopForm.State;
}

export const reducers = combineReducers<State, any>({
  portfolios: fromPortfolios.reducer,
  building: fromBuilding.reducer,
  splitShopForm: fromSplitShopForm.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('clientBuildings');

export const getPortfoliosState = createSelector(
  _getState,
  state => state.portfolios
);

export const getBuildingState = createSelector(
  _getState,
  state => state.building
);

export const getSplitShopFormState = createSelector(
  _getState,
  state => state.splitShopForm
);

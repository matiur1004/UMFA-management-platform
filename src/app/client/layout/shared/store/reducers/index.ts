import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromCommonData from './common-data.store';

export interface State {
  commonData: fromCommonData.State;
}

export const reducers = combineReducers<State, any>({
  commonData: fromCommonData.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('clientCommonData');

export const getCommonDataState = createSelector(
  _getState,
  state => state.commonData
);

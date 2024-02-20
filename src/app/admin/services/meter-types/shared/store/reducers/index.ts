import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer,} from '@ngrx/store';

import * as fromMeterTypeForm from './meter-types-form.store';

export interface State {
  mcMeterTypeForm: fromMeterTypeForm.State
}

export const reducers = combineReducers<State, any>({
  mcMeterTypeForm: fromMeterTypeForm.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('mcMeterTypes');

export const getFormState = createSelector(
  _getState,
  state => state.mcMeterTypeForm
);

export const getForm = createSelector(
  getFormState,
  fromMeterTypeForm.getFormState
);

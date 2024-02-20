import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromGeneralInfoForm from './general-info-form.store';

export interface State {
  generalInfoForm: fromGeneralInfoForm.State;
}

export const reducers = combineReducers<State, any>({
  generalInfoForm: fromGeneralInfoForm.reducer,
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('clientUserSettings');

export const getGeneralInfoFormState = createSelector(
  _getState,
  state => state.generalInfoForm
);

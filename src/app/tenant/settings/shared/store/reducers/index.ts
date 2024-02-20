import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromGeneralInfoForm from './../../../store/reducers/general-info-form.reducer';
import * as fromChangePasswordForm from './../../../store/reducers/general-info-form.reducer';

export interface State {
  generalInfoForm: fromGeneralInfoForm.State;
  changePasswordForm: fromChangePasswordForm.State;
}

export const reducers = combineReducers<State, any>({
  generalInfoForm: fromGeneralInfoForm.reducer,
  changePasswordForm: fromChangePasswordForm.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('tenantUserSettings');

export const getGeneralInfoFormState = createSelector(
  _getState,
  state => state.generalInfoForm
);

export const getChangePasswordFormState = createSelector(
  _getState,
  state => state.changePasswordForm
);

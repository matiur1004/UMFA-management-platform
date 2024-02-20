import {createFormGroupState, formGroupReducer, FormGroupState, updateGroup} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import * as addNewProfileFormActions from '../actions/add-new-profile.actions';
import {TenantBuildingPopupViewModel} from '../../profiles/models/profile.model';

export interface FormValue {
  activationNumber: string;
}

export const INIT_DEFAULT_STATE = {
  activationNumber: null
};

export const FORM_ID = 'addNewProfile';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  tenantBuilding: TenantBuildingPopupViewModel;
}

const validateAndUpdateForm = updateGroup<FormValue>({});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: addNewProfileFormActions.Action) {
    state = formGroupReducer(state, action);
    return validateAndUpdateForm(state);
  },
  tenantBuilding(state: TenantBuildingPopupViewModel = null, action: addNewProfileFormActions.Action) {
    switch (action.type) {
      case addNewProfileFormActions.SEARCH_TENANT_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;
export const getTenantBuilding = (state: State) => state.tenantBuilding;

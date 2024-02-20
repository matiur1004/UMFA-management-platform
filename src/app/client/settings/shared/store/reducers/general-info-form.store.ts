import {createFormGroupState, formGroupReducer, FormGroupState, updateGroup} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import * as settingsActions from '../actions/settings.actions';
import {ClientSettingViewModel} from '../../models/settings.model';

export const INIT_DEFAULT_STATE = {
  logoUrl: '',
  name: '',
  registrationNumber: '',
  vatNumber: '',
  email: '',
  address: '',
  phone: '',
  webAddress: ''
};

export const FORM_ID = 'userGeneralInfo';

export const InitState = createFormGroupState<ClientSettingViewModel>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<ClientSettingViewModel>;
}

const validateAndUpdateForm = updateGroup<ClientSettingViewModel>({});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: settingsActions.Action) {
    state = formGroupReducer(state, action);
    return validateAndUpdateForm(state);
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;

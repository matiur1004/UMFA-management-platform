import {createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {email, required} from 'ngrx-forms/validation';

import * as settingsActions from '../actions/settings.actions';


export interface FormValue {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  logoUrl: string;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  logoUrl: ''
};

export const FORM_ID = 'userGeneralInfo';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  logo: File;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  firstName: validate(required),
  lastName: validate(required),
  email: validate(required, email)
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: settingsActions.Action) {
    state = formGroupReducer(state, action);
    return validateAndUpdateForm(state);
  },
  logo(state = null, action: settingsActions.Action) {
    switch (action.type) {
      case settingsActions.SET_LOGO:
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
export const getLogo = (state: State) => state.logo;

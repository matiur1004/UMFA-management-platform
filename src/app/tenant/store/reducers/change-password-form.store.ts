import {createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {equalTo, required} from 'ngrx-forms/validation';

import * as settings from '../../settings/store/actions/settings.actions';


export interface FormValue {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export const INIT_DEFAULT_STATE = {
  oldPassword: '',
  password: '',
  confirmPassword: ''
};

export const FORM_ID = 'userChangePassword';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const validateAndUpdateForm = (state) => updateGroup<FormValue>({
  oldPassword: validate(required),
  password: validate(required),
  confirmPassword: validate(required, equalTo(state.value.password))
})(state);

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: settings.Action) {
    state = formGroupReducer(state, action);
    return validateAndUpdateForm(state);
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;

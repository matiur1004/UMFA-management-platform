import {createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {greaterThan, maxLength, required} from 'ngrx-forms/validation';

import {SupplyType} from '@models';

import * as fromActions from '../actions/add-new-charge.actions';

export interface FormValue {
  name: string;
  supplyType: SupplyType;
}

export const INIT_DEFAULT_STATE = {
  name: '',
  supplyType: SupplyType.Electricity
};

export const FORM_ID: string = 'add-new-charge';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  isComplete: boolean;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(255)),
  supplyType: validate(greaterThan(-1))
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: fromActions.AddNewChargeActions) {
    state = formGroupReducer(state, action);
    return validateAndUpdateForm(state);
  },
  isComplete(state: boolean, action: fromActions.AddNewChargeActions) {
    switch (action.type) {
      case fromActions.CREATE_NEW_CHARGE:
        return false;

      case fromActions.CREATE_NEW_CHARGE_SUCCESS:
        return true;

      default:
        return state;
    }
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

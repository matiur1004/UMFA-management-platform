import {createFormGroupState, formGroupReducer, FormGroupState, setValue, updateGroup, validate} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {greaterThan, maxLength, required} from 'ngrx-forms/validation';

import * as fromActions from '../actions/add-charge-line-item.actions';

export interface FormValue {
  id: string;
  name: string;
  chargingType: number;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  chargingType: 0
};

export const FORM_ID: string = 'add-charge-line-item';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  isComplete: boolean;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(255)),
  chargingType: validate(greaterThan(-1))
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: fromActions.AddChargeLineItemActions) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case fromActions.UPDATE_CHARGING_TYPE: {
        state = updateGroup<FormValue>({
          chargingType: (ctForm) => setValue(action.payload)(ctForm)
        })(state);
        break;
      }
    }

    return validateAndUpdateForm(state);
  },
  isComplete(state: boolean, action: fromActions.AddChargeLineItemActions) {
    switch (action.type) {
      case fromActions.RESET_IS_COMPLETE:
        return false;

      case fromActions.CREATE_LINE_ITEM:
        return true;

      default:
        return state;
    }
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

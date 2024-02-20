import {
  addArrayControl,
  createFormGroupState,
  FormGroupState,
  formStateReducer,
  removeArrayControl,
  updateArray,
  updateGroup,
  validate
} from "ngrx-forms";
import {Action, combineReducers} from "@ngrx/store";

import * as meterTypesFormActions from '../actions/meter-types-form.actions'
import {MeterTypeViewModel} from "@models";
import {required} from "ngrx-forms/validation";
import {StringExtension} from 'app/shared/helper/string-extension';


export interface FormValue {
  meterTypes: MeterTypeViewModel[];
}


export const INIT_DEFAULT_STATE = {
  meterTypes: []
}

export const FORM_ID: string = 'meterTypeForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  meterTypes: updateArray<MeterTypeViewModel>(
    updateGroup<MeterTypeViewModel>({
      name: validate(required)
    })
  )
})

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: meterTypesFormActions.Action) {

    s = formStateReducer(s, a);

    switch (a.type) {
      case meterTypesFormActions.ADD_METER_TYPE: {
        s = updateGroup<FormValue>({
          meterTypes: group => {
            const newGroup = addArrayControl(group, {
              id: StringExtension.NewGuid(),
              name: "",
              supplyType: 0,
              value: 0,
              quantity: 0
            });
            return newGroup;
          }
        })(s);
      }
        break;
      case meterTypesFormActions.REMOVE_METER_TYPE: {
        s = updateGroup<FormValue>({
          meterTypes: group => {
            return removeArrayControl(a.payload)(group);
          }
        })(s);
      }
        break;
    }

    return validateAndUpdateForm(s);
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;

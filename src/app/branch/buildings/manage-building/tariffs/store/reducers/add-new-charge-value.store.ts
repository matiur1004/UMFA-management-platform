import {
  createFormGroupState,
  disable,
  enable,
  formGroupReducer,
  FormGroupState,
  reset,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {greaterThan, maxLength, required} from 'ngrx-forms/validation';

import * as fromActions from '../actions/add-new-charge-value.actions';

export interface LineItemModel {
  lineItemId: string;
  name: string;
  enabled: boolean;
  increasePercentage: number;
}

export interface FormValue {
  id: string;
  name: string;
  additionalChargeId: string;
  baseAdditionalChargeValueId: string;
  startDate: null;
  endDate: null;
  increasePercentage: number;
  lineItemIncreases: LineItemModel[];
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: null,
  additionalChargeId: null,
  baseAdditionalChargeValueId: null,
  startDate: null,
  endDate: null,
  increasePercentage: 0,
  lineItemIncreases: []
};

export const FORM_ID: string = 'add-new-charge-value';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  isComplete: boolean;
}

const validateAndUpdateForm = (s) => updateGroup<any>({
  name: validate(required, maxLength(255)),
  startDate: validate(required),
  endDate: validate(required, (e) => greaterThan(new Date(s.value.startDate).getTime())(new Date(e).getTime())),
  lineItemIncreases: updateArray<LineItemModel>(updateGroup<LineItemModel>({
    increasePercentage: (c, parent) => parent.value.enabled ? enable(c) : disable(c)
  }))
})(s);

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: fromActions.AddNewChargeValueActions) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case fromActions.CREATE_NEW_CHARGE_VALUE_INIT: {
        state = reset(state);
        const {lineItems, baseAdditionalChargeValueId} = action.payload;
        let newLineItemIncreases: LineItemModel[];
        if (baseAdditionalChargeValueId && lineItems) {
          newLineItemIncreases = lineItems.map(li => ({
            lineItemId: li.lineItemId,
            increasePercentage: 0,
            name: li.name,
            enabled: true
          }));

          state = updateGroup<FormValue>({
            lineItemIncreases: (f) => setValue<LineItemModel[]>(newLineItemIncreases)(f),
            baseAdditionalChargeValueId: (f) => setValue<string>(baseAdditionalChargeValueId)(f)
          })(state);
        }
        break;
      }

      case fromActions.CREATE_NEW_CHARGE_VALUE_INCREASE_CHANGED:
        const commonIncrease = state.value.increasePercentage;
        const lineItemIncreases = state.value.lineItemIncreases.map(li => {
          return {...li, increasePercentage: commonIncrease};
        });
        state = updateGroup<FormValue>({
          lineItemIncreases: (f) => setValue<LineItemModel[]>(lineItemIncreases)(f),
        })(state);
        break;
    }

    return validateAndUpdateForm(state);
  },
  isComplete(state: boolean, action: fromActions.AddNewChargeValueActions) {
    switch (action.type) {
      case fromActions.CREATE_NEW_CHARGE_VALUE_INIT:
        return false;

      case fromActions.CREATE_NEW_CHARGE_VALUE_SUCCESS:
        return true;

      default:
        return state;
    }
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

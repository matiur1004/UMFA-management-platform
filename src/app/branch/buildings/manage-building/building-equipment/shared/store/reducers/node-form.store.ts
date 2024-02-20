import {createFormGroupState, formGroupReducer, FormGroupState, setValue, updateGroup, validate,} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {maxLength, required} from 'ngrx-forms/validation';

import * as nodeFormActions from '../actions/node-form.actions';
import {SupplyType} from '@models';

export interface FormValue {
  id: string;
  name: string;
  supplyType: SupplyType;
  supplyToId: string;
  supplyToLocationId: string;
  description: string;
  tariffApplyType: number;
  costProviderActive: boolean;
  costProviderFactor: number;
  costProviderRegister: string;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  supplyType: SupplyType.Electricity,
  supplyToId: null,
  supplyToLocationId: null,
  description: '',
  tariffApplyType: 0,
  costProviderActive: false,
  costProviderFactor: 1,
  costProviderRegister: ''
};

export const FORM_ID: string = 'buildingNodeForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(150))
});

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: nodeFormActions.Action) {
    s = formGroupReducer(s, a);
    //console.log(a.type, a['payload'], s);
    switch (a.type) {
      case nodeFormActions.UPDATE_SUPPLY_TO: {
        s = updateGroup<FormValue>({
          supplyToId: setValue<string>(a.payload)
        })(s);
        break;
      }
      case nodeFormActions.UPDATE_TARIFF_APPLY_TYPE: {
        s = updateGroup<FormValue>({
          tariffApplyType: setValue<number>(a.payload)
        })(s);
        break;
      }
      case nodeFormActions.UPDATE_LOCATION_TYPE: {
        s = updateGroup<FormValue>({
          supplyToLocationId: setValue<string>(a.payload)
        })(s);
        break;
      }
      case nodeFormActions.UPDATE_COST_TARIFF: {
        s = updateGroup<FormValue>({
          costProviderFactor: setValue<number>(a.payload.costProviderFactor),
          costProviderRegister: setValue<string>(a.payload.costProviderRegister)
        })(s);
        break;
      }
    }

    return validateAndUpdateForm(s);
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;

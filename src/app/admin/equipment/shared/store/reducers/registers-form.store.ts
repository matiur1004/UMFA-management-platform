import {RegisterType} from './../../../../../shared/models/register.model';
import {
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  formStateReducer,
  reset,
  setValue,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import * as registerFormAction from '../actions/registers-form.actions';
import {required} from 'ngrx-forms/validation';
import {SupplyType, TimeOfUse} from '@models';

export interface FormValue {
  id: string;
  name: string;
  description: string;
  unitOfMeasurement: number;
  supplyTypes: SupplyType[];
  timeOfUse: TimeOfUse;
  registerType: RegisterType;
  isSystem: boolean;
  obisCode: string;

}

export const DEFAULT_STATE = {
  id: null,
  name: '',
  description: '',
  unitOfMeasurement: null,
  supplyTypes: [],
  timeOfUse: TimeOfUse.None,
  registerType: RegisterType.Consumption,
  isSystem: false,
  obisCode: ''
};

export const FORM_ID = 'registersForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID,
  {
    ...DEFAULT_STATE
  });

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required),
  description: validate(required),
  unitOfMeasurement: validate(required),
  supplyTypes: validate(required),
  timeOfUse: validate(required)
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: registerFormAction.Action) {
    s = formStateReducer(s, a);

    switch (a.type) {
      case registerFormAction.REGISTER_INIT_FOR_EDIT: {
        const model = a.payload.model;
        const newItem = {
          ...model,
          supplyTypes: model.supplyTypes ? [...model.supplyTypes] : []
        };
        s = setValue<FormValue>(s, newItem);
        s = reset(s);
        s = updateGroup<FormValue>({
          unitOfMeasurement: unitOfMeasurement => model && model.isSystem ? disable(unitOfMeasurement) : enable(unitOfMeasurement)
        })(s);
      }
        break;
      case registerFormAction.REGISTER_INIT_FOR_CREATE: {
        const newItem = {
          ...DEFAULT_STATE,
          supplyTypes: []
        };
        s = setValue<FormValue>(s, newItem);
        s = reset(s);
      }
        break;
      case registerFormAction.REGISTER_ADD_SUPPLY_TYPE:
        s = updateGroup<FormValue>({
          supplyTypes: supplyTypes => {
            const newValue: SupplyType[] = [...supplyTypes.value, a.payload.type];
            const newGroup = setValue(supplyTypes, newValue);
            return newGroup;
          }
        })(s);
        break;

      case registerFormAction.REGISTER_REMOVE_SUPPLY_TYPE:
        s = updateGroup<FormValue>({
          supplyTypes: supplyTypes => {
            const newValue: SupplyType[] = [...supplyTypes.value].filter(t => t !== a.payload.type);
            const newGroup = setValue(supplyTypes, newValue);
            return newGroup;
          }
        })(s);
        break;

      case registerFormAction.REGISTER_EDIT_TOU:
        s = updateGroup<FormValue>({
          timeOfUse: timeOfUse => {
            return setValue(timeOfUse, a.payload.timeOfUse);
          }
        })(s);
        break;
    }

    return validateAndUpdateForm(s);
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;

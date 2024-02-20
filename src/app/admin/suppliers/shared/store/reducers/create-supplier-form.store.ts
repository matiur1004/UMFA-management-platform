import {
  createFormGroupState,
  FormGroupState,
  formStateReducer,
  setValue,
  updateGroup,
  validate,
  ValidationFn
} from 'ngrx-forms';
import {maxLength, required} from 'ngrx-forms/validation';
import {Action, combineReducers} from '@ngrx/store';
import {SupplyType} from '@models';
import * as supplierCommonActions from '../actions/supplier-common.actions';

export interface CreateSupplierFormValue {
  name: string;
  supplyTypes: { [key: number]: boolean };
}

const SupplierDefaultState = {
  name: '',
  supplyTypes: {
    [SupplyType.Electricity]: false,
    [SupplyType.Gas]: false,
    [SupplyType.Sewerage]: false,
    [SupplyType.Water]: false,
    [SupplyType.AdHoc]: false
  }
};
export const CreateSupplierFormId = 'CreateSupplierForm';

export const InitState = createFormGroupState<CreateSupplierFormValue>(CreateSupplierFormId,
  {
    ...SupplierDefaultState
  });

export interface State {
  formState: FormGroupState<CreateSupplierFormValue>;
}

const requireSupplyType: ValidationFn<{ [key: number]: boolean }> = (value) => {
  return Object.keys(SupplyType).findIndex(k => value[k]) >= 0 ? {} : {'required': {actual: value}};
};

const validateAndUpdateForm = updateGroup<CreateSupplierFormValue>({
  name: validate(required, maxLength(255)),
  supplyTypes: validate(requireSupplyType)
});


const reducers = combineReducers<State, any>({
  formState(state = InitState, a: supplierCommonActions.Action) {
    state = formStateReducer(state, a);
    switch (a.type) {
      case supplierCommonActions.SUPPLIER_ADD_NEW:
        const s = {...SupplierDefaultState};
        state = setValue(state, s);
        break;

      default:
    }
    return validateAndUpdateForm(state);
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

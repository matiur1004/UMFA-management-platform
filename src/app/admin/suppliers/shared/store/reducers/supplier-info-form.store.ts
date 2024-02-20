import {
  createFormGroupState,
  FormGroupState,
  formStateReducer,
  setValue,
  updateGroup,
  validate,
  ValidationFn
} from 'ngrx-forms';
import {maxLength, required} from "ngrx-forms/validation";
import {Action, combineReducers} from '@ngrx/store';

import { AddressPhysicalViewModel, AddressPostalViewModel, SupplyType} from '@models';

import * as supplierFormAction from '../actions/supplier-info-form.actions'

export interface SupplierFormValue {
  name: string;
  description: string;
  supplyTypes: { [key: number]: boolean };
  registrationNumber: string;
  vatNumber: string;
  webAddress: string;
  email: string;
  phone: string;
  logo: File;
  postalAddress: AddressPostalViewModel;
  physicalAddress: AddressPhysicalViewModel;
}

export const SupplierDefaultState = {
  name: '',
  description: '',
  supplyTypes: {
    [SupplyType.Electricity]: false,
    [SupplyType.Gas]: false,
    [SupplyType.Sewerage]: false,
    [SupplyType.Water]: false,
    [SupplyType.AdHoc]: false
  },
  registrationNumber: '',
  vatNumber: '',
  webAddress: '',
  email: '',
  phone: '',
  logo: null,
  postalAddress: new AddressPostalViewModel(),
  physicalAddress: new AddressPhysicalViewModel()
}
export const SupplierFormId = 'SupplierInfoForm';

export const InitState = createFormGroupState<SupplierFormValue>(SupplierFormId,
  {
    ...SupplierDefaultState
  });

export interface State {
  formState: FormGroupState<SupplierFormValue>;
  showSupplierInfoForm: boolean;
  logoUrl: string;
}

const requireSupplyType: ValidationFn<{ [key: number]: boolean }> = (value) => {
  return Object.keys(SupplyType).findIndex(k => value[k]) >= 0 ? {} : {'required': {actual: value}};
};

const requireAddress: ValidationFn<AddressPhysicalViewModel> = (item: any) => {
  const value = item.value || item;
  const toValidate = (({line1, city, code, country, description}) => ({
    line1,
    city,
    code,
    country,
    description
  }))(value);

  return Object.values(toValidate).some(x => !x) ? {'required': {actual: value}} : {};
};


const validateAndUpdateForm = updateGroup<SupplierFormValue>({
  name: validate(required, maxLength(255)),
  supplyTypes: validate(requireSupplyType),
  postalAddress: validate(requireAddress),
  physicalAddress: validate(requireAddress),
});


const reducers = combineReducers<State, any>({
  formState(state = InitState, a: supplierFormAction.Action) {
    state = formStateReducer(state, a);

    switch (a.type) {
      case supplierFormAction.SUPPLIER_LOGO_SELECTED:
        let s = {...state.value};
        s.logo = a.payload;
        state = setValue(state, s);
        break;

      default:
    }

    return validateAndUpdateForm(state);
  },
  logoUrl(state: string, action: supplierFormAction.Action) {
    if (action.type === supplierFormAction.SET_SUPPLIER_LOGO_URL) {
      return action.payload;
    }
    return state;
  },
  showSupplierInfoForm(state: boolean, action: supplierFormAction.Action) {
    if (action.type === supplierFormAction.SET_SHOW_SUPPLIER_INFO_FORM) {
      return action.payload;
    }
    return state;
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

import {ChargingType, MeterTypeViewModel} from '@models';
import {Action, combineReducers} from '@ngrx/store';
import {currencyValidator} from 'app/shared/validators/currency.validator';
import {
  addArrayControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  removeArrayControl,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {maxLength, required} from 'ngrx-forms/validation';

import * as serviceFormActions from '../actions/service-form.actions';

export interface SupplyTypesValue {
  id: string,
  isActive: boolean;
  fixedPrice: number;
  minimalFee: number;
  perTenant: number;
  perShop: number;
  perSquareMeter: number;
  perBuilding: number;
  perCouncilAccount: number;
  perHour: number;
  perMeter: number;
  meterTypes: MeterTypeViewModel[];
}

export interface FormValue {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  chargingType: ChargingType;
  serviceCategoryIsFullMetering: boolean;
  serviceCategoryIsPartialMetering: boolean;
  serviceCategoryIsPrepaidMetering: boolean;
  serviceCategoryIsSingleTenant: boolean;
  electricity: SupplyTypesValue;
  water: SupplyTypesValue;
  sewerage: SupplyTypesValue;
  gas: SupplyTypesValue;
  adHoc: SupplyTypesValue;
}

const defaultServiceItem = (): any => {
  return {
    id: '',
    isActive: false,
    fixedPrice: 0,
    minimalFee: 0,
    perTenant: 0,
    perShop: 0,
    perSquareMeter: 0,
    perBuilding: 0,
    perCouncilAccount: 0,
    perHour: 0,
    perMeter: 0,
    meterTypes: []
  };
};

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  description: '',
  isActive: true,
  chargingType: ChargingType.Regular,
  serviceCategoryIsFullMetering: true,
  serviceCategoryIsPartialMetering: false,
  serviceCategoryIsPrepaidMetering: false,
  serviceCategoryIsSingleTenant: false,
  electricity: defaultServiceItem(),
  water: defaultServiceItem(),
  sewerage: defaultServiceItem(),
  gas: defaultServiceItem(),
  adHoc: defaultServiceItem()
};

export const FORM_ID: string = 'mcServiceForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  isNew: boolean;
  isComplete: boolean;
  parentId: string;
  meterTypes: MeterTypeViewModel[];
}

const resetNumberForInvalidValue = (control, parentGroup) => {
  if (parentGroup.controls.isActive.value) {
    return control;
  }

  return control.isValid ? control : setValue(control, 0);
};

const resetNumberForInvalidArray = (control, parentGroup) => {
  if (parentGroup.controls.isActive.value) {
    return control;
  }

  control.controls.forEach(ctrl => {
    ctrl.controls.value = ctrl.controls.value.isValid ? ctrl.controls.value : setValue(ctrl.controls.value, 0);
  });

  return control;
};

const validationServieItemFn = (): any => {
  return {
    fixedPrice: validate(currencyValidator),
    minimalFee: validate(required, currencyValidator),
    perTenant: validate(required, currencyValidator),
    perShop: validate(required, currencyValidator),
    perSquareMeter: validate(required, currencyValidator),
    perMeter: validate(required, currencyValidator),
    meterTypes: updateArray<MeterTypeViewModel>(
      updateGroup<MeterTypeViewModel>({
        value: validate(required, currencyValidator)
      })
    ),
    perBuilding: validate(currencyValidator),
    perCouncilAccount: validate(currencyValidator),
    perHour: validate(currencyValidator)
  };
};

const updateServiceItemFn = (): any => {
  return {
    fixedPrice: resetNumberForInvalidValue,
    minimalFee: resetNumberForInvalidValue,
    perTenant: resetNumberForInvalidValue,
    perShop: resetNumberForInvalidValue,
    perMeter: resetNumberForInvalidValue,
    perSquareMeter: resetNumberForInvalidValue,
    perBuilding: resetNumberForInvalidValue,
    perCouncilAccount: resetNumberForInvalidValue,
    perHour: resetNumberForInvalidValue,
    meterTypes: resetNumberForInvalidArray
  };
};

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(150)),
  electricity: (state) => {
    return updateGroup<SupplyTypesValue>(state, validationServieItemFn(), updateServiceItemFn());
  },
  water: (state) => {
    return updateGroup<SupplyTypesValue>(state, validationServieItemFn(), updateServiceItemFn());
  },
  sewerage: (state) => {
    return updateGroup<SupplyTypesValue>(state, validationServieItemFn(), updateServiceItemFn());
  },
  gas: (state) => {
    return updateGroup<SupplyTypesValue>(state, validationServieItemFn(), updateServiceItemFn());
  },
  adHoc: (state): any => {
    return updateGroup<SupplyTypesValue>(state, validationServieItemFn(), updateServiceItemFn());
  },
});

const reducers = combineReducers<State, any>({

  formState(s = InitState, a: any) {
    s = formGroupReducer(s, a);
    switch (a.type) {
      case serviceFormActions.ADD_METER_TYPE: {
        const {payload} = a;
        const {meterType, key} = payload;

        s = updateGroup<FormValue>({
          [key]: supplierGroup => {
            return updateGroup<SupplyTypesValue>({
              meterTypes: group => {
                return addArrayControl(group, meterType);
              }
            })(supplierGroup);
          }
        })(s);
      }
        break;

      case serviceFormActions.REMOVE_METER_TYPE: {
        const {payload} = a;
        const {index, key} = payload;

        s = updateGroup<FormValue>({
          [key]: supplierGroup => {
            return updateGroup<SupplyTypesValue>({
              meterTypes: group => {
                return removeArrayControl(index)(group);
              }
            })(supplierGroup);
          }
        })(s);
      }
        break;
      default:
        break;
    }
    return validateAndUpdateForm(s);
  },
  isNew(s: boolean, a: serviceFormActions.Action) {
    switch (a.type) {
      case serviceFormActions.EDIT_SERVICE:
        return false;

      case serviceFormActions.CREATE_SERVICE:
        return true;

      default:
        return s;
    }
  },
  isComplete(s: boolean, a: serviceFormActions.Action) {
    switch (a.type) {
      case serviceFormActions.CREATE_SERVICE:
      case serviceFormActions.EDIT_SERVICE:
        return false;

      case serviceFormActions.SEND_SERVICE_REQUEST_COMPLETE:
        return true;

      default:
        return s;
    }
  },
  parentId(s: string, a: serviceFormActions.Action) {
    switch (a.type) {
      case serviceFormActions.UPDATE_PARENT_ID:
        return a.payload;

      default:
        return s;
    }
  },
  meterTypes(s: any[] = [], a: serviceFormActions.Action) {
    switch (a.type) {
      case serviceFormActions.GET_METER_TYPES_COMPLETE:
        return a.payload;

      default:
        return s;
    }
  }

});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormSate = (state: State) => state.formState;
export const getIsNew = (state: State) => state.isNew;
export const getIsComplete = (state: State) => state.isComplete;
export const getAllMeterTypes = (state: State) => state.meterTypes;






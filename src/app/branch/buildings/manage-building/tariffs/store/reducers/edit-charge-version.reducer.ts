import {
  addArrayControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  removeArrayControl,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {maxLength, required} from 'ngrx-forms/validation';
import {Action, combineReducers} from '@ngrx/store';

import * as editChargeActions from '../actions/edit-charge-version.actions';
import * as lineItemActions from '../actions/add-charge-line-item.actions';
import * as addChargeActions from '../actions/add-charge-line-item.actions';
import * as additionalChargesActions from '../actions/additional-charges.actions';

import {
  BasedOnFixedPriceChargeLineItemViewModel,
  BasedOnReadingsChargeLineItemViewModel,
  ChargeEditViewModel,
  ChargeLineItemChargingType
} from '../../../shared/models';
import {OrderVersion, RegisterViewModel} from '@models';
import {sortRule} from '@shared-helpers';

type Actions = editChargeActions.EditChargeVersionActions
  | lineItemActions.AddChargeLineItemActions
  | additionalChargesActions.BuildingAdditionalChargesActions
  | addChargeActions.AddChargeLineItemActions;

export interface FormValue {
  charge: ChargeEditViewModel;
}

export const initialFormState: FormValue = {
  charge: new ChargeEditViewModel()
};

export const FORM_ID: string = 'edit-charge-version';

export const InitialState = createFormGroupState<FormValue>(FORM_ID, {
  ...initialFormState
});

export interface State {
  formState: FormGroupState<FormValue>;
  registers: RegisterViewModel[];
  valuesVersions: any;
  valuesOrder: OrderVersion;
  chargeId: string;
}

const validateAndUpdateForm = (s) => updateGroup<FormValue>({
  charge: cf => updateGroup<ChargeEditViewModel>({
    name: validate(required, maxLength(150)),
    basedOnReadingsLineItems: updateArray(
      updateGroup<BasedOnReadingsChargeLineItemViewModel>({
        name: validate(required, maxLength(150)),
        chargingType: validate(required),
        registerId: validate(required),
      })
    ),
    fixedPriceLineItems: updateArray(
      updateGroup<BasedOnFixedPriceChargeLineItemViewModel>({
        name: validate(required, maxLength(150)),
        chargingType: validate(required),
        registerId: validate(required),
        basicPeriod: validate(required),
      })
    )
  })(cf)
})(s);

const reducers = combineReducers<State, any>({
  formState(state = InitialState, action: Actions) {
    state = formGroupReducer(state, action);
    switch (action.type) {

      case addChargeActions.CREATE_LINE_ITEM: {
        const lineItemData = getLineItemData(action.payload.chargingType);

        state = updateGroup<FormValue>({
          charge: (cf) => updateGroup<ChargeEditViewModel>({
            [lineItemData.name]: (sf) => addArrayControl(new lineItemData.constructor(action.payload.name))(sf)
          })(cf)
        })(state);
        break;
      }

      case editChargeActions.DELETE_CHARGE_LINE_ITEM: {
        const lineItemData = getLineItemData(action.payload.chargingType);
        const index = state.value.charge[lineItemData.name].findIndex(item => item.id === action.payload.id);

        state = updateGroup<FormValue>({
          charge: (cf) => updateGroup<ChargeEditViewModel>({
            [lineItemData.name]: (sf) => removeArrayControl(index)(sf)
          })(cf)
        })(state);
        break;
      }

      case editChargeActions.UPDATE_TYPE_CHARGE_LINE_ITEM: {
        const {id, newChargingType, oldChargingType} = action.payload;
        const charges = state.value.charge;

        const oldLineItemData = getLineItemData(oldChargingType);
        const oldLineItem = charges[oldLineItemData.name].find(item => item.id === id);
        const oldIndex = charges[oldLineItemData.name].findIndex(item => item.id === id);

        const newLineItemData = getLineItemData(newChargingType);
        let newLineItem = new newLineItemData.constructor(oldLineItem.name);
        newLineItem = {...newLineItem, ...oldLineItem, chargingType: newChargingType};

        state = updateGroup<FormValue>({
          charge: (cf) => updateGroup<ChargeEditViewModel>({
            [oldLineItemData.name]: (sf) => removeArrayControl(oldIndex)(sf)
          })(cf)
        })(state);

        state = updateGroup<FormValue>({
          charge: (cf) => updateGroup<ChargeEditViewModel>({
            [newLineItemData.name]: (sf) => addArrayControl(newLineItem)(sf)
          })(cf)
        })(state);
        break;
      }

      case editChargeActions.PURGE_EDIT_CHARGE_VERSION_STORE: {
        return InitialState;
      }
    }

    return validateAndUpdateForm(state);
  },
  registers(state = null, action: Actions) {
    switch (action.type) {

      case editChargeActions.GET_EQUIPMENT_REGISTERS_SUCCESS: {
        return action.payload;
      }

      case editChargeActions.PURGE_EDIT_CHARGE_VERSION_STORE: {
        return null;
      }

      default:
        return state;
    }
  },
  valuesVersions(state = null, action: Actions) {
    switch (action.type) {

      case editChargeActions.GET_CHARGE_DATA_SUCCESS: {
        const stateCopy = [...action.payload.additionalChargeValues];
        return sortVersions(stateCopy, OrderVersion.ValuesAsc, 'name');
      }


      case additionalChargesActions.SET_CHARGE_VALUE_VERSIONS_ORDER: {
        if (!state) break;
        const stateCopy = [...state];
        return sortVersions(stateCopy, action.payload, 'name');
      }

      case editChargeActions.PURGE_EDIT_CHARGE_VERSION_STORE: {
        return null;
      }

      default:
        return state;
    }
  },
  valuesOrder(state = OrderVersion.ValuesAsc, action: Actions) {
    switch (action.type) {

      case additionalChargesActions.SET_CHARGE_VALUE_VERSIONS_ORDER: {
        return action.payload;
      }

      case editChargeActions.PURGE_EDIT_CHARGE_VERSION_STORE:
      case editChargeActions.GET_CHARGE_DATA_SUCCESS: {
        return OrderVersion.ValuesAsc;
      }

      default:
        return state;
    }
  },
  chargeId(state = null, action: Actions) {
    switch (action.type) {

      case editChargeActions.SET_CHARGE_VERSION_ID: {
        return action.payload;
      }

      default:
        return state;
    }
  }
});

// HELPERS
const getLineItemData = (
  lineItemFormValue: ChargeLineItemChargingType
) => {
  switch (lineItemFormValue) {
    case ChargeLineItemChargingType.BasedOnReadings: {
      return {
        name: 'basedOnReadingsLineItems',
        constructor: BasedOnReadingsChargeLineItemViewModel
      };
    }

    case ChargeLineItemChargingType.FixedPrice: {
      return {
        name: 'fixedPriceLineItems',
        constructor: BasedOnFixedPriceChargeLineItemViewModel
      };
    }
  }
};

const sortVersions = (versions: any[], order: number, valueOrder: string) => {
  const sortedVersions = [...versions];
  switch (order) {
    case OrderVersion.ValuesAsc:
      return sortedVersions.sort((a, b) => sortRule(a[valueOrder], b[valueOrder]));
    case OrderVersion.ValuesDesc:
      return sortedVersions.sort((a, b) => sortRule(b[valueOrder], a[valueOrder]));
    case OrderVersion.CreatedAsc:
      return sortedVersions.sort((a, b) => sortRule(a.createdOn, b.createdOn));
    case OrderVersion.CreatedDesc:
      return sortedVersions.sort((a, b) => sortRule(b.createdOn, a.createdOn));
    case OrderVersion.CreatedByAsc:
      return sortedVersions.sort((a, b) => sortRule(a.createdByUser.fullName, b.createdByUser.fullName));
    case OrderVersion.CreatedByDesc:
      return sortedVersions.sort((a, b) => sortRule(b.createdByUser.fullName, a.createdByUser.fullName));
    case OrderVersion.UpdatedAsc:
      return sortedVersions.sort((a, b) => sortRule(a.updatedOn, b.updatedOn));
    case OrderVersion.UpdatedDesc:
      return sortedVersions.sort((a, b) => sortRule(b.updatedOn, a.updatedOn));
    case OrderVersion.UpdatedByAsc:
      return sortedVersions.sort((a, b) => sortRule(a.updatedByUser.fullName, b.updatedByUser.fullName));
    case OrderVersion.UpdatedByDesc:
      return sortedVersions.sort((a, b) => sortRule(b.updatedByUser.fullName, a.updatedByUser.fullName));
    default:
      return sortedVersions;
  }
};

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

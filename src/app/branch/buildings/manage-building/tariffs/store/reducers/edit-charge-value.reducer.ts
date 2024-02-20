import {createFormGroupState, formGroupReducer, FormGroupState, updateArray, updateGroup, validate} from 'ngrx-forms';
import {greaterThan, maxLength, required} from 'ngrx-forms/validation';
import {Action, combineReducers} from '@ngrx/store';

import * as fromActions from '../actions';
import {sortRule} from '@shared-helpers';
import {ChargeEditValueViewModel, ChargeLineItemValuesViewModel, OrderVersion} from '../../../shared/models';


export interface FormValue {
  editValue: ChargeEditValueViewModel;
}

export const initialFormState: FormValue = {
  editValue: new ChargeEditValueViewModel(),
};

export const FORM_ID: string = 'edit-charge-value';

export const InitialState = createFormGroupState<FormValue>(FORM_ID, {
  ...initialFormState
});

export interface State {
  formState: FormGroupState<FormValue>;
  valuesVersions: any;
  valuesOrder: OrderVersion;
  chargeId: string;
  valueId: string;
}

const validateAndUpdateForm = (s) => updateGroup<FormValue>({
  editValue: cf => updateGroup<ChargeEditValueViewModel>({
    name: validate(required, maxLength(150)),
    startDate: validate(required),
    endDate: validate(required, (e) => greaterThan(new Date(s.value.editValue.startDate).getTime())(new Date(e).getTime())),
    lineItemValues: updateArray<ChargeLineItemValuesViewModel>(
      updateGroup<any>({
        value: validate(required)
      })
    ),
  })(cf)
})(s);

const reducers = combineReducers<State, any>({
  formState(state = InitialState, action: fromActions.Actions) {
    state = formGroupReducer(state, action);
    switch (action.type) {

      case fromActions.PURGE_EDIT_CHARGE_VALUE_STORE: {
        return InitialState;
      }
    }

    return validateAndUpdateForm(state);
  },
  valuesVersions(state = null, action: fromActions.Actions) {
    switch (action.type) {

      case fromActions.GET_CHARGE_VALUE_DATA_SUCCESS: {
        const stateCopy = [...action.payload.versions];
        return sortVersions(stateCopy, OrderVersion.ValuesAsc, 'name');
      }

      case fromActions.SET_CHARGE_VALUE_VERSIONS_ORDER: {
        if (!state) break;
        const stateCopy = [...state];
        return sortVersions(stateCopy, action.payload, 'name');
      }

      case fromActions.PURGE_EDIT_CHARGE_VALUE_STORE: {
        return null;
      }

      default:
        return state;
    }
  },
  valuesOrder(state = OrderVersion.ValuesAsc, action: fromActions.Actions) {
    switch (action.type) {

      case fromActions.SET_CHARGE_VALUE_VERSIONS_ORDER: {
        return action.payload;
      }

      case fromActions.PURGE_EDIT_CHARGE_VALUE_STORE:
      case fromActions.GET_CHARGE_VALUE_DATA_SUCCESS: {
        return OrderVersion.ValuesAsc;
      }

      default:
        return state;
    }
  },
  chargeId(state = null, action: fromActions.Actions) {
    switch (action.type) {

      case fromActions.SET_CHARGE_VALUE_IDS: {
        return action.payload.chargeId;
      }

      default:
        return state;
    }
  },
  valueId(state = null, action: fromActions.Actions) {
    switch (action.type) {

      case fromActions.SET_CHARGE_VALUE_IDS: {
        return action.payload.valueId;
      }

      default:
        return state;
    }
  }
});

// HELPERS
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

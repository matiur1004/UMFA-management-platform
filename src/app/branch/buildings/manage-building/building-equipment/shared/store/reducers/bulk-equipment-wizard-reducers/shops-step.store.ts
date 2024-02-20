import {
  Boxed,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import {CommonAreaViewModel, ShopViewModel} from '@models';
import * as shopsStepActions from '../../actions/bulk-equipment-wizard-actions/shops-step.actions';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';
import {required} from 'ngrx-forms/validation';
import { ShopStepDescriptionFieldType } from '../../../models/bulk-action.model';

export interface LocationGroupMetersFormValue {
  locationId: string;
  groupId: string;
  locationName: string;
  meters: UnitMetersFormValue[];
}

export interface UnitMetersFormValue {
  id: string;
  equipmentGroupId: string;
  manufactureDate: string;
  deviceId: string;
  deviceTypeName: string;
  actualPhoto: string;
  equipmentGroupName: string;
  isSelected: boolean;
  supplyToId: string;
  locationType: string;
  locationId: string;
  serialNumber: string;
  unitIds: Boxed<string[]>;
  unitName: string;
  description: string;
  parentMeters: Boxed<string[]>;
  supplyType: number;
  descriptionField: ShopStepDescriptionFieldType;
}

export interface FormValue {
  locationGroupMeters: LocationGroupMetersFormValue[];
  meters: UnitMetersFormValue[];
}

export const INIT_DEFAULT_STATE = {
  locationGroupMeters: [],
  meters: []
};

export interface State {
  formState: FormGroupState<FormValue>;
  filter: FilterAttribute;
  meterDropdownData: any;
  shops: ShopViewModel[];
  commonAreas: CommonAreaViewModel[];
}

export const FORM_ID = 'buildingBulkEquipmentShopsStep';

export const InitFilter = {category: -1, supplyType: -1, searchTerm: ''};

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({
  locationGroupMeters: updateArray<LocationGroupMetersFormValue>(
    updateGroup<LocationGroupMetersFormValue>({
      meters: updateArray<UnitMetersFormValue>(
        updateGroup<UnitMetersFormValue>({
          serialNumber: validate(required, () => {
            let numbs = [];
            cur_state.value.locationGroupMeters.map((x: { meters: any[]; }) => x.meters.map(m => m.serialNumber)).forEach((element: any[]) => {
              element.forEach(e => {
                numbs.push(e)
              });
            });

            return hasDuplicates(numbs) ? {duplicated: true} : null
          })
        })
      )
    })
  )
});

let cur_state: any;

function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
    var value = array[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
}

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: shopsStepActions.Action) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case shopsStepActions.SELECT_ALL_METERS: {
        const locationGroupMeters = state.value.locationGroupMeters.map(item => {
          return {
            ...item,
            meters: item.meters.map(m => {
              return {
                ...m,
                isSelected: action.payload
              };
            })
          };
        });
        const s = {...state.value, locationGroupMeters: locationGroupMeters};
        state = setValue(state, s);
        break;
      }

      case shopsStepActions.UPDATE_LOCATION_METERS: {
        const locationGroupMeters = [...state.value.locationGroupMeters];
        const meters = [...state.value.locationGroupMeters[action.payload.locationIdx].meters];
        const meter = {...meters[action.payload.previousIdx]};
        meters.splice(action.payload.previousIdx, 1, {...meters[action.payload.currentIdx]});
        meters.splice(action.payload.currentIdx, 1, meter);
        locationGroupMeters.splice(action.payload.locationIdx, 1, {
          ...locationGroupMeters[action.payload.locationIdx],
          meters: meters
        });

        const s = {...state.value, locationGroupMeters: locationGroupMeters};
        state = setValue(state, s);
        break;
      }

      default:
        state;
    }
    cur_state = state;
    return validateAndUpdateForm(state);
  },
  filter(state: FilterAttribute = InitFilter, action: shopsStepActions.Action) {
    switch (action.type) {
      case shopsStepActions.FILTER_SHOPS:
        return action.payload;
      default:
        return state;
    }
  },
  meterDropdownData(state = {}, action: shopsStepActions.Action) {
    switch (action.type) {
      case shopsStepActions.SET_DROPDOWN_DATA:
        return action.payload;
      default:
        return state;
    }
  },
  shops(state = [], action: shopsStepActions.Action) {
    switch (action.type) {
      case shopsStepActions.SET_SHOPS:
        return action.payload;
      default:
        return state;
    }
  },
  commonAreas(state = [], action: shopsStepActions.Action) {
    switch (action.type) {
      case shopsStepActions.SET_COMMON_AREAS:
        return action.payload;
      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;
export const getFilterForm = (state: State) => state.filter;
export const getMeterDropdownData = (state: State) => state.meterDropdownData;
export const getShops = (state: State) => state.shops;
export const getCommonAreas = (state: State) => state.commonAreas;

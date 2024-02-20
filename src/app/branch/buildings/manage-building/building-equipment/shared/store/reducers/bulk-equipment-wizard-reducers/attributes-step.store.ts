import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import * as attributesStepActions from '../../actions/bulk-equipment-wizard-actions/attributes-step.actions';
import {pattern} from 'ngrx-forms/validation';
import {FieldType, SupplyType} from '@models';
import {ratioRegex} from '@shared-helpers';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';

export interface HeaderAttribute {
  id: string;
  name: string;
  fieldType: FieldType;
}

export interface MeterAttributesFormValue {
  serialNumber: string;
  sequenceNumber: number;
  locationName: string;
  locationId: any;
  deviceId: string;
  deviceTypeName: string;
  equipmentGroupId: string;
  isSelected: boolean;
  supplyType: SupplyType;
  attributes: any;
}

export interface EquipmentGroupMetersFormValue {
  equipmentGroupId: string;
  headerAttributes: HeaderAttribute[];
  meters: MeterAttributesFormValue[];
}

export interface FormValue {
  equipmentGroupMeters: EquipmentGroupMetersFormValue[];
}


export const INIT_DEFAULT_STATE = {
  equipmentGroupMeters: []
};

export interface State {
  formState: FormGroupState<FormValue>;
  filter: FilterAttribute;
}

export const FORM_ID = 'buildingBulkEquipmentAttributesStep';

export const InitFilter = {category: -1, supplyType: -1, searchTerm: ''};

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({
  equipmentGroupMeters: updateArray<EquipmentGroupMetersFormValue>(updateGroup<EquipmentGroupMetersFormValue>({
    meters: updateArray<MeterAttributesFormValue>(updateGroup<MeterAttributesFormValue>({
      attributes: (s: any) => {
        const updateDef = Object.keys(s.value).filter(id => s.value[id].attribute.fieldType === FieldType.Ratio)
          .reduce((acc, id) => {
            acc[id] = updateGroup<any>({
              value: validate(pattern(ratioRegex))
            });
            return acc;
          }, {});
        return updateGroup<any>(updateDef)(s);
      },
    }))
  }))
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: attributesStepActions.Action) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case attributesStepActions.SELECT_ALL_METERS: {
        const array = [...state.value.equipmentGroupMeters];
        const index = array.findIndex(item => item.equipmentGroupId === action.payload.equipmentGroupId);
        let meters = [...array[index].meters];
        meters = array[index].meters.map(m => ({...m, isSelected: action.payload.isSelected}));

        array.splice(index, 1, {...array[index], meters: meters});
        const s = {...state.value, equipmentGroupMeters: array};
        state = setValue(state, s);
        break;
      }

      case attributesStepActions.ATTRIBUTE_PHOTO_CHANGED: {
        const array = [...state.value.equipmentGroupMeters];
        const index = array.findIndex(item => item.equipmentGroupId === action.payload.equipmentGroupId);
        const meters = array[index].meters.map(m => {
          if (m.serialNumber !== action.payload.serialNumber) {
            return m;
          }
          const attributes = {...m.attributes};
          attributes[action.payload.attributeId].photo = action.payload.file;
          return {
            ...m,
            attributes: attributes
          };
        });
        array.splice(index, 1, {...array[index], meters: meters});
        const s = {...state.value, equipmentGroupMeters: array};
        state = setValue(state, s);
        break;
      }
    }
    return validateAndUpdateForm(state);
  },

  filter: (state: FilterAttribute = InitFilter, action: attributesStepActions.Action) => {
    switch (action.type) {
      case attributesStepActions.FILTER_WIZARD_EQUIPMENT: {
        return action.payload;
      }

      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;
export const getFilterFormState = (state: State) => state.filter;



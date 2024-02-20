import {createFormGroupState, formGroupReducer, FormGroupState, setValue, updateGroup} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {MeterRegisterViewModel} from '../../../models';

import * as registersAndReadingsStepActions
  from '../../actions/bulk-equipment-wizard-actions/registers-and-readings-step.actions';
import {moveItemInArray} from '@shared-helpers';
import {EquipmentTemplateViewModel, SupplyType} from '@models';
import { FilterAttribute } from '../../../models/search-filter.model';

export interface MeterRegistersFormValue {
  equipmentGroupId: string;
  equipmentTemplateId: string;
  sequenceNumber: number;
  locationName: string;
  locationId: string;
  supplyType: SupplyType;
  deviceId: string;
  deviceTypeName: string;
  serialNumber: string;
  isSelected: boolean;
  registers: MeterRegisterViewModel[];
}

export interface FormValue {
  meters: MeterRegistersFormValue[];
}

export const INIT_DEFAULT_STATE = {
  meters: []
};

export const FORM_ID = 'buildingBulkEquipmentRegistersAndReadingsStep';

export const InitFilter = {category: -1, supplyType: -1, searchTerm: ''};

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  equipmentTemplates: EquipmentTemplateViewModel[];
  registerFiles: any;
  filter: FilterAttribute;
}

const validateAndUpdateForm = updateGroup<FormValue>({});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: registersAndReadingsStepActions.Action) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case registersAndReadingsStepActions.SELECT_ALL_METERS: {
        const meters = state.value.meters.map(item => {
          return {
            ...item,
            isSelected: action.payload
          };
        });
        const s = {...state.value, meters: meters};
        state = setValue(state, s);
        break;
      }

      case registersAndReadingsStepActions.CHANGE_REGISTER_SCALE: {
        const array = [...state.value.meters];
        const meterIndex = array.findIndex(m => m.serialNumber === action.payload.serialNumber);
        const registers = [...array[meterIndex].registers];
        registers.splice(action.payload.index, 1, {
          ...registers[action.payload.index],
          registerScaleId: action.payload.scaleId
        });
        array.splice(meterIndex, 1, {...array[meterIndex], registers: registers});
        const s = {...state.value, meters: array};
        state = setValue(state, s);
        break;
      }

      case registersAndReadingsStepActions.CHANGE_REGISTER_SEQUENCE: {
        const array = [...state.value.meters];
        const meterIndex = array.findIndex(m => m.serialNumber === action.payload.serialNumber);
        const registers = [...array[meterIndex].registers];
        moveItemInArray(registers, action.payload.from, action.payload.to);
        array.splice(meterIndex, 1, {...array[meterIndex], registers: registers});
        const s = {...state.value, meters: array};
        state = setValue(state, s);
        break;
      }

      case registersAndReadingsStepActions.REMOVE_REGISTER: {
        const array = [...state.value.meters];
        const meterIndex = array.findIndex(m => m.serialNumber === action.payload.serialNumber);
        const registers = [...array[meterIndex].registers];
        array.splice(meterIndex, 1, {
          ...array[meterIndex],
          registers: registers.filter(r => r.id !== action.payload.registerId)
        });
        const s = {...state.value, meters: array};
        state = setValue(state, s);
        break;
      }

      case registersAndReadingsStepActions.ADD_REGISTER: {
        const array = [...state.value.meters];
        const date = new Date();
        const meterIndex = array.findIndex(m => m.serialNumber === action.payload.serialNumber);
        array.splice(meterIndex, 1, {
          ...array[meterIndex], registers: [...array[meterIndex].registers, {
            ...action.payload.register,
            date: date
          }]
        });
        const s = {...state.value, meters: array};
        state = setValue(state, s);
        break;
      }
    }
    return validateAndUpdateForm(state);
  },
  equipmentTemplates(state = [], action: registersAndReadingsStepActions.Action) {
    switch (action.type) {
      case registersAndReadingsStepActions.SET_EQUIPMENT_TEMPLATES:
        return action.payload;

      default:
        return state;
    }
  },
  registerFiles(state = {}, action: any) {
    switch (action.type) {
      case registersAndReadingsStepActions.ADD_REGISTER_FILE: {
        const {serialNumber, registerId, file} = action.payload;

        const s = {...state};

        if (!s[serialNumber]) {
          s[serialNumber] = {};
        }

        s[serialNumber][registerId] = {
          file: file
        };

        return s;
      }

      default:
        return state;
    }
  },
  filter: (state: FilterAttribute = InitFilter, action: registersAndReadingsStepActions.Action) => {
    switch (action.type) {
      case registersAndReadingsStepActions.FILTER_WIZARD_EQUIPMENT: {
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
export const getRegisterFiles = (state: State) => state.registerFiles;
export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getFilterFormState = (state: State) => state.filter;

import {ValidationErrors} from '@angular/forms';
import {
  CommonAreaViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  EquipmentTemplateViewModel,
  FieldType,
  LocationViewModel,
  ShopViewModel,
  SupplyToViewModel,
  TemplateListItemViewModel
} from '@models';
import {Action, combineReducers} from '@ngrx/store';
import {moveItemInArray, numberRegex, ratioRegex} from '@shared-helpers';
import {
  box,
  Boxed,
  createFormArrayState,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  removeArrayControl,
  setValue,
  unbox,
  updateArray,
  updateArrayWithFilter,
  updateGroup,
  validate
} from 'ngrx-forms';
import {maxLength, pattern, required} from 'ngrx-forms/validation';
import {AssignedVirtualRegister, MeterDetailViewModel, MeterRegisterViewModel, VirtualRegisterType} from '../../models';

import * as equipmentFormActions from '../actions/equipment-form.actions';

export interface FormValue {
  id: string;
  parentMeters: string[];
  serialNumber: string;
  manufactureDate: string;
  equipmentModel: string;
  supplyType: number;
  photos: File[];
  registers: MeterRegisterViewModel[];
  virtualRegisters: AssignedVirtualRegister[];
  attributes: EquipmentTemplateAttributeViewModel[];
  unitIds: Boxed<any[]>;
  equipmentGroup: EquipmentGroupViewModel;

  locationId: string;
  locationName: string;
  supplyId: string;
  supplyName: string;
  locationType: string;
  description: string;
  isVerification: boolean;
  testingDate: Date;
  testingNote: string;
  technicianId: string;
  technicianName: string;

  isDisplayOBISCode: boolean;
  isDummy: boolean;
  isFaulty: boolean;
  reasonOfFaulty: string;

  actualPhoto: File;
  logoUrl: string;

  isSmartModel: boolean;

  breakerState: boolean;
  supplyToLocationId: string;

  amrImportDate: string;
  isConnectedToAmr: boolean;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  parentMeters: [],
  serialNumber: '',
  manufactureDate: '',
  equipmentModel: '',
  supplyType: 0,
  photos: [],
  registers: [],
  virtualRegisters: [],
  attributes: [],
  unitIds: box([]),
  equipmentGroup: new EquipmentGroupViewModel(),

  locationId: '',
  locationName: '',
  supplyId: '',
  supplyName: '',
  locationType: '',
  description: '',
  isVerification: false,
  testingDate: null,
  testingNote: '',
  technicianId: '',
  technicianName: '',

  isDisplayOBISCode: false,
  isDummy: false,
  isFaulty: false,
  reasonOfFaulty: '',

  actualPhoto: null,
  logoUrl: null,

  isSmartModel: false,

  breakerState: true,
  supplyToLocationId: '',

  amrImportDate: '',
  isConnectedToAmr: false
};

export const FORM_ID = 'buildingEquipment';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  equipmentTemplate: EquipmentTemplateViewModel;
  equipmentTemplates: TemplateListItemViewModel[];
  meters: MeterDetailViewModel[];
  shops: ShopViewModel[];
  commonAreas: CommonAreaViewModel[];
  locations: LocationViewModel[];
  supplies: SupplyToViewModel[];
  isComplete: boolean;
}

export const dummyValidator = (isDummy: string) => {
  return (value: string): ValidationErrors => {
    let res = null;
    if (!isDummy) {
      res = required(value);
    }
    return res;
  };
};

const validateAndUpdateForm = (state) => {
  const validateForm = updateGroup<FormValue>({
    registers: updateArray<MeterRegisterViewModel>(
      updateGroup<MeterRegisterViewModel>({
        ratio: validate(required, pattern(numberRegex))
      })
    ),
    serialNumber: validate(dummyValidator(state.value.isDummy), maxLength(100)),
    attributes: updateArrayWithFilter((a) => a.value.attribute.fieldType === FieldType.Ratio,
      updateGroup<EquipmentTemplateAttributeViewModel>({
        value: validate(pattern(ratioRegex))
      }))
  });

  return validateForm(state);
};

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: equipmentFormActions.Action) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case equipmentFormActions.UPDATE_ACTUAL_PHOTO: {
        const s = {...state.value};
        s.actualPhoto = action.payload.photo;
        s.logoUrl = action.payload.photoUrl;
        state = setValue(state, s);
        break;
      }

      case equipmentFormActions.TARGET_METER_REGISTER: {
        const s = {...state.value};
        const vRegisters = [...state.value.virtualRegisters];
        const selectedVRIndex = vRegisters.findIndex(vr => vr.id === action.payload.vrId);

        vRegisters[selectedVRIndex] = {
          ...vRegisters[selectedVRIndex],
          signalMeterAssignment: {
            ...vRegisters[selectedVRIndex].signalMeterAssignment,
            targetRegisterId: action.payload.id
          }
        };

        state = setValue(state, {
          ...state.value,
          virtualRegisters: vRegisters
        });

        break;
      }

      case equipmentFormActions.EXPAND_VIRTUAL_REGISTER: {
        const vRegisters = [...state.value.virtualRegisters];
        const id = action.payload;
        const selectedVRIndex = vRegisters.findIndex(vr => vr.id === id);

        vRegisters[selectedVRIndex] = {
          ...vRegisters[selectedVRIndex],
          isExpanded: !vRegisters[selectedVRIndex].isExpanded
        };

        state = setValue(state, {
          ...state.value,
          virtualRegisters: vRegisters
        });

        break;
      }

      case equipmentFormActions.CLEAR_LOCAL_EQUIPMENT: {
        state = InitState;
        break;
      }

      case equipmentFormActions.UPDATE_ATTRIBUTE_PHOTO: {
        const attributeId = action.payload.attributeId;
        const s = {
          ...state.value,
          attributes: state.value.attributes.map((a) => a.attribute.id === attributeId ? {
            ...a,
            photo: action.payload.photo,
            newPhotoUrl: action.payload.photoUrl
          } : a)
        };
        state = setValue(state, s);
        break;
      }
      case equipmentFormActions.COMBO_SETTINGS_CHANGE: {
        state = updateGroup<FormValue>({
          attributes: c => {
            const idx = action.payload.value.index;
            const attributes = c.value;
            const newAttr = [...unbox(attributes)];
            newAttr.splice(idx, 1, {...attributes[idx], value: action.payload.value.value});
            c = setValue(c, newAttr);
            return c;
          }
        })(state);

        break;
      }
      case equipmentFormActions.CHANGE_REGISTER_SCALE: {
        const idx = action.payload.index;
        const registers = [...state.value.registers];
        registers[idx] = {
          ...registers[idx],
          registerScaleId: action.payload.scaleId
        };
        state = setValue(state, {
          ...state.value,
          registers: registers
        });
        break;
      }
      case equipmentFormActions.CHANGE_REGISTER_SEQUENCE: {
        const registers = [...state.value.registers];
        moveItemInArray(registers, action.payload.from, action.payload.to);
        state = setValue(state, {
          ...state.value,
          registers: registers
        });
        break;
      }

      case equipmentFormActions.CHANGE_VIRTUAL_REGISTER_SEQUENCE: {
        const virtualRegisters = [...state.value.virtualRegisters];
        moveItemInArray(virtualRegisters, action.payload.from, action.payload.to);
        state = updateGroup<FormValue>({
          virtualRegisters: vrs => createFormArrayState<AssignedVirtualRegister>(FORM_ID + '.virtualRegisters', virtualRegisters)
        })(state);
        break;
      }

      case equipmentFormActions.REMOVE_VIRTUAL_REGISTER: {
        const registerIndex = state.value.virtualRegisters.findIndex(r => r.id === action.payload);
        state = updateGroup<FormValue>({
          virtualRegisters: removeArrayControl(registerIndex)
        })(state);
        break;
      }

      case equipmentFormActions.REMOVE_ASSIGNED_REGISTER: {
        const virtualRegisters = [...state.value.virtualRegisters];
        const vrIndex = virtualRegisters.findIndex(vr => vr.id === action.payload.vrId);

        switch (action.payload.type) {
          case VirtualRegisterType.MeterTotal:
            const assignedRegister = virtualRegisters.find(vr => vr.id === action.payload.vrId)
              .meterTotalAssignment
              .assignedRegisters.find(mt => mt.id === action.payload.assignedMeterId);
            const notAssignedRegisters = virtualRegisters.find(vr => vr.id === action.payload.vrId)
              .meterTotalAssignment
              .assignedRegisters.filter(mt => mt.id !== action.payload.assignedMeterId);

            virtualRegisters[vrIndex] = {
              ...virtualRegisters[vrIndex],
              bulkRegisters: [...virtualRegisters[vrIndex].bulkRegisters, assignedRegister],
              meterTotalAssignment: {
                ...virtualRegisters[vrIndex].meterTotalAssignment,
                assignedRegisters: notAssignedRegisters
              }
            };

            break;
        }

        const s = {...state.value};

        s.virtualRegisters = virtualRegisters;
        state = setValue(state, s);
        break;
      }

      case equipmentFormActions.CHANGE_PARENT_METER: {
        const s = {...state.value};
        s.parentMeters = action.payload;
        state = setValue(state, s);
        break;
      }

      case equipmentFormActions.CONNECT_TO_AMR_REQUEST_COMPLETE: {
        const s = {...state.value};
        s.isSmartModel = true;
        s.isConnectedToAmr = true;
        state = setValue(state, s);
        break;
      }

      case equipmentFormActions.TOGGLE_BREAKER_REQUEST_COMPLETE: {
        const s = {...state.value};
        s.breakerState = action.payload;
        state = setValue(state, s);
        break;
      }

      case equipmentFormActions.SET_EQUIPMENT_DETAIL_REGISTERS: {
        const s = {...state.value};
        s.registers = action.payload;
        state = setValue(state, s);
        break;
      }
      default:
        state;
    }
    return validateAndUpdateForm(state);
  },
  shops(state = [], action: equipmentFormActions.Action) {
    switch (action.type) {
      case equipmentFormActions.GET_SHOPS_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  commonAreas(state = [], action: equipmentFormActions.Action) {
    switch (action.type) {
      case equipmentFormActions.GET_COMMON_AREAS_REQUEST_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  },
  locations(state = [], action: equipmentFormActions.Action) {
    switch (action.type) {
      case equipmentFormActions.GET_LOCATIONS_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  supplies(state = [], action: equipmentFormActions.Action) {
    switch (action.type) {
      case equipmentFormActions.GET_SUPPLIES_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  isComplete(state: boolean, a: equipmentFormActions.Action) {
    switch (a.type) {
      case equipmentFormActions.EDIT_EQUIPMENT:
        return false;

      case equipmentFormActions.SEND_REQUEST_EQUIPMENT_COMPLETE:
        return true;

      default:
        return state;
    }
  },
  equipmentTemplate(state: EquipmentTemplateViewModel = null, act: equipmentFormActions.Action) {
    switch (act.type) {
      case equipmentFormActions.GET_EQUIPMENT_TEMPLATE_REQUEST_COMPLETE:
        //act.payload.registers.array.sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0));
        return act.payload;
      default:
        return state;
    }
  },
  equipmentTemplates(state: TemplateListItemViewModel[] = [], act: equipmentFormActions.Action) {
    switch (act.type) {
      case equipmentFormActions.GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE:
        //act.payload.registers.sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0));
        return act.payload;
      default:
        return state;
    }
  },
  meters(state = [], action: equipmentFormActions.Action) {

    switch (action.type) {
      case equipmentFormActions.GET_METERS_REQUEST_COMPLETE:
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
export const getLocations = (state: State) => state.locations;
export const getSupplies = (state: State) => state.supplies;
export const getShops = (state: State) => state.shops;
export const getCommonAreas = (state: State) => state.commonAreas;
export const getIsComplete = (state: State) => state.isComplete;
export const getEquipmentTemplate = (state: State) => state.equipmentTemplate;
export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getMeters = (state: State) => state.meters;

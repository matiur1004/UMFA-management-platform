import {
  addArrayControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  removeArrayControl,
  setValue,
  updateArrayWithFilter,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {EquipmentViewModel, MeterRegisterViewModel} from '../../../models';
import {maxLength, required} from 'ngrx-forms/validation';

import * as replaceEquipmentStepActions
  from '../../actions/replace-equipment-wizard-actions/replace-equipment-step.actions';
import {EquipmentAttributeValueViewModel, EquipmentGroupViewModel, SupplyType} from '@models';

import {addRegisterFile} from '../../utilities/replace-wizard';
import {moveItemInArray} from '@shared-helpers';

export interface FormValue {
  id: string;
  parentMeters: string[];
  serialNumber: string;
  manufactureDate: string;
  equipmentGroup: EquipmentGroupViewModel;
  isDisplayOBISCode: boolean;
  equipmentPhotoUrl: string;
  equipmentModel: string;
  registers: MeterRegisterViewModel[];
  attributes: EquipmentAttributeValueViewModel[];
  supplyType: number;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  parentMeters: [],
  equipmentModel: null,
  serialNumber: null,
  manufactureDate: null,
  isDisplayOBISCode: true,
  registers: [],
  attributes: [],
  supplyType: SupplyType.Electricity,
  equipmentGroup: new EquipmentGroupViewModel(),
  equipmentPhotoUrl: null
};

export interface State {
  formState: FormGroupState<FormValue>;
  location: any;
  shopIds: string[];
  commonAreaIds: string[];
  equipmentTemplates: any[];
  selectedTemplate: EquipmentViewModel;
  meters: any[];
  registerFiles: any;
  actualPhoto: any;
}

export const FORM_ID: string = 'buildingReplaceEquipmentStep';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({
  serialNumber: validate(required, maxLength(150))
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: replaceEquipmentStepActions.Action) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case replaceEquipmentStepActions.UPDATE_ATTRIBUTE_PHOTO: {
        const {attributeId, photo, photoUrl} = action.payload;
        state = updateGroup<FormValue>({
          attributes: updateArrayWithFilter<EquipmentAttributeValueViewModel>(
            (a) => a.value.attribute.id === attributeId,
            (c) => setValue<EquipmentAttributeValueViewModel>({...c.value, photo: photo, newPhotoUrl: photoUrl})(c)
          )
        })(state);
        break;
      }

      case replaceEquipmentStepActions.COMBO_SETTINGS_CHANGE: {
        const {index, value} = action.payload.value;
        state = updateGroup<FormValue>({
          attributes: updateArrayWithFilter<EquipmentAttributeValueViewModel>(
            (_, idx) => idx === index,
            (c) => setValue({...c.value, value: value})(c)
          )
        })(state);
        break;
      }

      case replaceEquipmentStepActions.CHANGE_REGISTER_SCALE: {
        const {index, scaleId} = action.payload;
        state = updateGroup<FormValue>({
          registers: updateArrayWithFilter<MeterRegisterViewModel>(
            (_, idx) => idx === index,
            (c) => setValue({...c.value, registerScaleId: scaleId})(c)
          )
        })(state);
        break;
      }

      case replaceEquipmentStepActions.CHANGE_REGISTER_SEQUENCE: {
        const registers = [...state.value.registers];
        moveItemInArray(registers, action.payload.from, action.payload.to);
        state = setValue(state, {
          ...state.value,
          registers: registers
        });
        break;
      }

      case replaceEquipmentStepActions.CHANGE_PARENT_METER: {
        state = updateGroup<FormValue>({
          parentMeters: (c) => setValue<string[]>(action.payload)(c)
        })(state);
        break;
      }

      case replaceEquipmentStepActions.REMOVE_REGISTER: {
        state = updateGroup<FormValue>({
          registers: (c) => removeArrayControl(c.value.findIndex(item => item.id === action.payload))(c)
        })(state);
        break;
      }

      case replaceEquipmentStepActions.ADD_REGISTER: {
        state = updateGroup<FormValue>({
          registers: (c) => addArrayControl(action.payload)(c)
        })(state);
        break;
      }

      default:
        break;
    }
    return validateAndUpdateForm(state);
  },
  equipmentTemplates(state = [], action: replaceEquipmentStepActions.Action) {

    switch (action.type) {
      case replaceEquipmentStepActions.GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  selectedTemplate(state = new EquipmentViewModel(), action: replaceEquipmentStepActions.Action) {

    switch (action.type) {
      case replaceEquipmentStepActions.SET_SELECTED_TEMPLATE:
        return action.payload;

      default:
        return state;
    }
  },
  meters(state = [], action: replaceEquipmentStepActions.Action) {

    switch (action.type) {
      case replaceEquipmentStepActions.GET_METERS_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  registerFiles(state = {}, action: replaceEquipmentStepActions.Action) {
    switch (action.type) {
      case replaceEquipmentStepActions.ADD_REGISTER_FILE: {

        const {registerId, file} = action.payload;

        return addRegisterFile(state, registerId, file);
      }

      case replaceEquipmentStepActions.RESET_EQUIPMENT_STEP:
        return {};

      default:
        return state;
    }
  },
  location(state = {}, action: replaceEquipmentStepActions.Action) {
    switch (action.type) {
      case replaceEquipmentStepActions.SET_LOCATION:
        return action.payload;

      default:
        return state;
    }
  },
  shopIds(state = [], action: replaceEquipmentStepActions.Action) {
    switch (action.type) {
      case replaceEquipmentStepActions.SET_SHOP_IDS:
        return action.payload;

      default:
        return state;
    }
  },
  commonAreaIds(state = [], action: replaceEquipmentStepActions.Action) {
    switch (action.type) {
      case replaceEquipmentStepActions.SET_COMMON_AREA_IDS:
        return action.payload;

      default:
        return state;
    }
  },
  actualPhoto(state = {}, action: replaceEquipmentStepActions.Action) {
    switch (action.type) {
      case replaceEquipmentStepActions.UPDATE_ACTUAL_PHOTO: {
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

export const getSelectedTemplate = (state: State) => state.selectedTemplate;
export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getMeters = (state: State) => state.meters;
export const getFormState = (state: State) => state.formState;
export const getRegisterFiles = (state: State) => state.registerFiles;
export const getLocation = (state: State) => state.location;
export const getActualPhoto = (state: State) => state.actualPhoto;

import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  updateArrayWithFilter,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {MeterEquipmentViewModel} from '../../models';
import {maxLength, pattern, required} from 'ngrx-forms/validation';
import {ValidationErrors} from '@angular/forms';

import * as equipmentStepActions from '../actions/equipment-step.actions';
import {
  EquipmentAttributeValueViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateViewModel,
  FieldType,
  TemplateListItemViewModel
} from '@models';
import {moveItemInArray, ratioRegex} from '@shared-helpers';

export const INIT_DEFAULT_STATE = {
  id: '',
  parentMeters: [],
  equipmentModel: null,
  serialNumber: null,
  manufactureDate: null,
  isDisplayOBISCode: true,
  registers: [],
  attributes: [],
  supplyType: null,
  equipmentGroup: new EquipmentGroupViewModel(),
  actualPhoto: null,
  logoUrl: '',
  equipmentPhotoUrl: null,
  isDummy: false,
  isFaulty: false,
  reasonOfFaulty: '',

  photos: []
};

export interface State {
  formState: FormGroupState<MeterEquipmentViewModel>;
  equipmentTemplates: TemplateListItemViewModel[];
  selecetedTemplate: EquipmentTemplateViewModel;
  meters: any[];
  registerFiles: any;
}

export const FORM_ID = 'buildingEquipmentStep';

export const InitState = createFormGroupState<MeterEquipmentViewModel>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

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
  const validateForm = updateGroup<MeterEquipmentViewModel>({
    equipmentModel: validate(required),
    serialNumber: validate(dummyValidator(state.value.isDummy), maxLength(100)),
    attributes: updateArrayWithFilter((a) => a.value.attribute.fieldType === FieldType.Ratio,
      updateGroup<EquipmentAttributeValueViewModel>({
        value: validate(pattern(ratioRegex))
      }))
  });

  return validateForm(state);
};

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: equipmentStepActions.Action) {
    state = formGroupReducer(state, action);

    switch (action.type) {
      case equipmentStepActions.UPDATE_ACTUAL_PHOTO: {
        const s = {...state.value};
        s.actualPhoto = action.payload;
        state = setValue(state, s);
        break;
      }

      case equipmentStepActions.UPDATE_ATTRIBUTE_PHOTO: {
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
      case equipmentStepActions.COMBO_SETTINGS_CHANGE: {
        const idx = action.payload.value.index;
        const s = {...state.value};
        const attributes = [...s.attributes];
        const attr = {...attributes[idx]};
        attr['value'] = action.payload.value.value;
        attributes[idx] = {...attr};
        s.attributes = [...attributes];
        state = setValue(state, s);

        break;
      }
      case equipmentStepActions.CHANGE_REGISTER_SCALE: {
        const idx = action.payload.index;
        const s = {...state.value};
        const registers = [...s.registers];
        const reg = {...registers[idx]};

        reg.registerScaleId = action.payload.scaleId;
        registers[idx] = {...reg};
        s.registers = [...registers];
        state = setValue(state, s);

        break;
      }
      case equipmentStepActions.CHANGE_REGISTER_SEQUENCE: {
        const registers = [...state.value.registers];
        moveItemInArray(registers, action.payload.from, action.payload.to);
        state = setValue(state, {
          ...state.value,
          registers: registers
        });
        break;
      }
      case equipmentStepActions.CHANGE_PARENT_METER: {
        const s = {...state.value};
        s.parentMeters = action.payload;
        state = setValue(state, s);

        break;
      }
      case equipmentStepActions.RESET_EQUIPMENT_STEP_FORM: {
        state = InitState;
        break;
      }

      default:
        break;
    }
    return validateAndUpdateForm(state);
  },
  equipmentTemplates(state = [], action: equipmentStepActions.Action) {

    switch (action.type) {
      case equipmentStepActions.GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  selecetedTemplate(state = new EquipmentTemplateViewModel(), action: equipmentStepActions.Action) {
    switch (action.type) {
      case equipmentStepActions.SET_SELECTED_TEMPLATE:
        return action.payload;

      default:
        return state;
    }
  },
  meters(state = [], action: equipmentStepActions.Action) {
    switch (action.type) {
      case equipmentStepActions.GET_METERS_REQUEST_COMPLETE:
        return action.payload;

      default:
        return state;
    }
  },
  registerFiles(state = {}, action: any) {
    switch (action.type) {
      case equipmentStepActions.ADD_REGISTER_FILE: {
        const {registerId, file} = action.payload;
        const s = {...state};

        s[registerId] = {
          file: file
        };

        return s;
      }

      case equipmentStepActions.RESET_EQUIPMENT_STEP:
        return {};

      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getMeters = (state: State) => state.meters;
export const getEquipmentStepFormState = (state: State) => state.formState;
export const getRegisterFiles = (state: State) => state.registerFiles;
export const getSelecetedTemplateState = (state: State) => state.selecetedTemplate;

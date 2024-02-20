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
import {greaterThanOrEqualTo, lessThanOrEqualTo, required} from 'ngrx-forms/validation';

import * as setupStepActions from '../../actions/bulk-equipment-wizard-actions/setup-step.actions';

import {EquipmentGroupViewModel, LocationViewModel, SupplyToViewModel, TemplateListItemViewModel} from '@models';

export interface EquipmentTemplateFormValue {
  id: string;
  equipmentGroupId: string;
  equipmentId?: string;
  deviceId: string;
  locationId: string;
  photo: string;
  serialNumber: string;
  numberOfEquipmentTemplate: number;
  manufactureDate: string;
  supplyToId: string;
  locationType: string;
  isSelected: boolean;
}

export interface FormValue {
  templates: EquipmentTemplateFormValue[];
}

export const INIT_DEFAULT_STATE = {
  templates: []
};

export interface State {
  formState: FormGroupState<FormValue>;

  equipmentGroups: EquipmentGroupViewModel[];
  equipmentTemplates: TemplateListItemViewModel[];
  locations: LocationViewModel[];
  supplies: SupplyToViewModel[];
  filteredDropdownData: any;
}

export const FORM_ID = 'buildingBulkEquipmentSetupStep';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

const validateAndUpdateForm = updateGroup<FormValue>({
    templates: updateArray<EquipmentTemplateFormValue>(
      updateGroup<EquipmentTemplateFormValue>({
        equipmentGroupId: validate(required),
        serialNumber: validate(required),
        equipmentId: validate(required),
        deviceId: validate(required),
        locationId: validate(required),
        numberOfEquipmentTemplate: validate(required, greaterThanOrEqualTo(1), lessThanOrEqualTo(50))
      })
    )
  }
);

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: setupStepActions.Action) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case setupStepActions.SELECT_ITEM: {
        const templates = [...state.value.templates];
        const eqTemplateIndex = templates.findIndex(t => t.id === action.payload.templateId);
        templates[eqTemplateIndex] = {
          ...templates[eqTemplateIndex],
          isSelected: !templates[eqTemplateIndex].isSelected
        };

        const s = {...state.value, templates};
        state = setValue(state, s);

        break;
      }

      case setupStepActions.SELECT_ALL_ITEM: {
        const templates = state.value.templates.map(t => {
          return {
            ...t,
            isSelected: action.payload
          };
        });
        const s = {...state.value, templates};
        state = setValue(state, s);
        break;
      }

      case setupStepActions.CHANGE_IMAGE: {
        const templates = [...state.value.templates];
        const templateIdx = templates.findIndex(t => t.id === action.payload.templateId);
        const template = templates[templateIdx];

        templates[templateIdx] = {
          ...template,
          photo: action.payload.photo
        };

        const s = {...state.value, templates};
        state = setValue(state, s);
        break;
      }

      case setupStepActions.REMOVE_ITEM: {
        const templates = [...state.value.templates];
        if (!action.payload.selected) {
          const index = templates.findIndex(bt => bt.id === action.payload.id);
          if (templates.length > 1) {
            templates.splice(index, 1);
            const s = {...state.value, templates};
            state = setValue(state, s);
          }
        } else {
          // Remove template from bulk action
          const templatesNotSelected = templates.filter(t => !t.isSelected);

          if (templatesNotSelected.length >= 1) {
            const s = {...state.value, templates: templatesNotSelected};
            state = setValue(state, s);
          }
        }
        break;
      }
      default:
        state;
    }
    return validateAndUpdateForm(state);
  },
  equipmentGroups(state = [], action: setupStepActions.Action) {
    switch (action.type) {
      case setupStepActions.GET_EQUIPMENT_GROUPS_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  equipmentTemplates(state = [], action: setupStepActions.Action) {
    switch (action.type) {
      case setupStepActions.GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  locations(state = [], action: setupStepActions.Action) {
    switch (action.type) {
      case setupStepActions.GET_LOCATIONS_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  supplies(state = [], action: setupStepActions.Action) {
    switch (action.type) {
      case setupStepActions.GET_SUPPLIES_REQUEST_COMPLETE:
        return action.payload;
      default:
        return state;
    }
  },
  filteredDropdownData(state = {}, action: setupStepActions.Action) {
    switch (action.type) {
      case setupStepActions.SET_DROPDOWN_DATA:
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
export const getEquipmentGroups = (state: State) => state.equipmentGroups;
export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getSupplies = (state: State) => state.supplies;
export const getLocations = (state: State) => state.locations;
export const getFilteredDropdownData = (state: State) => state.filteredDropdownData;

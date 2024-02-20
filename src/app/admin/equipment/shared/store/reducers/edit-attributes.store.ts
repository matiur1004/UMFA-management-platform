import {Action, combineReducers} from '@ngrx/store';
import {required} from 'ngrx-forms/validation';
import {
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  formStateReducer,
  reset,
  setValue,
  updateGroup,
  validate
} from 'ngrx-forms';

import {
  EquipmentComboSettingsViewModel,
  EquipmentGroupViewModel,
  EquipmentOptionsViewModel,
  EquipmentUnitViewModel,
  FieldType
} from '@models';
import * as editAttributesAction from '../actions/edit-attributes.actions';

export interface FormValue {
  id: string;
  name: string;
  isImportant: boolean;
  canAddPhoto: boolean;
  fieldType: FieldType;
  unit: EquipmentUnitViewModel;
  comboSettings: EquipmentComboSettingsViewModel[];
  unitValues: string[];
  equipmentGroups: EquipmentGroupViewModel[];
  isSystem: boolean;
  isAvailableForTariff: boolean;
  isRequired: boolean;
}


export const DEFAULT_STATE = {
  id: '',
  name: '',
  isImportant: false,
  canAddPhoto: false,
  fieldType: FieldType.Number,
  unit: {id: null, name: null},
  comboSettings: [],
  equipmentGroups: [],
  unitValues: [],
  isSystem: false,
  isAvailableForTariff: false,
  isRequired: false
};

export const UNITS_ID: string = 'editUnits';

export const InitState = createFormGroupState<FormValue>(UNITS_ID,
  {
    ...DEFAULT_STATE
  });

export interface State {
  formState: FormGroupState<FormValue>;
  options: EquipmentOptionsViewModel;
}

const reducers = combineReducers<State, any>({
  options(s: EquipmentOptionsViewModel = {
    units: [],
    comboSettings: [],
    groups: []
  }, a: editAttributesAction.Action) {
    switch (a.type) {
      case editAttributesAction.ATTRIBUTES_SET_OPTIONS: {
        return {...a.payload.value};
      }
    }
  },

  formState(s = InitState, a: editAttributesAction.Action) {
    s = formStateReducer(s, a);
    switch (a.type) {
      case editAttributesAction.ATTRIBUTES_INIT:
        s = setValue<FormValue>(s, DEFAULT_STATE);
        s = reset(s);
        s = updateGroup<FormValue>({
          comboSettings: comboSettings => disable(comboSettings),
          unit: unit => enable(unit)
        })(s);
        break;

      case editAttributesAction.ATTRIBUTES_INIT_FOR_EDIT:
        s = setValue<FormValue>(s, a.payload.value);
        if (a.payload.value.fieldType === FieldType.Number) {
          s = updateGroup<FormValue>({
            comboSettings: comboSettings => disable(comboSettings),
            unit: unit => enable(unit),
          })(s);
        } else {
          s = updateGroup<FormValue>({
            unit: unit => disable(unit),
            comboSettings: comboSettings => enable(comboSettings),
          })(s);
        }
        s = reset(s);
        break;

      case editAttributesAction.ATTRIBUTES_ADD_GROUP:
        s = updateGroup<FormValue>({
          equipmentGroups: equipmentGroups => {
            let newValue: EquipmentGroupViewModel[] = [...equipmentGroups.value, a.payload.group];
            const newGroup = setValue(equipmentGroups, newValue);
            return newGroup;
          }
        })(s);
        break;
      case editAttributesAction.ATTRIBUTES_REMOVE_GROUP:
        s = updateGroup<FormValue>({
          equipmentGroups: equipmentGroups => {
            let newValue: EquipmentGroupViewModel[] = equipmentGroups.value.filter(g => g.id !== a.payload.group.id);
            const newGroup = setValue(equipmentGroups, newValue);
            return newGroup;
          }
        })(s);
        break;

      case editAttributesAction.ATTRIBUTES_CHANGE_FIELD_TYPE:
        const hasUnit = a.payload.value === FieldType.Number;
        s = updateGroup<FormValue>({
          unit: updateGroup<EquipmentUnitViewModel>({
            name: name => {
              const newName = setValue(name, null);
              return hasUnit ? enable(newName) : disable(newName);
            },
            id: id => {
              const newId = setValue(id, null);
              return hasUnit ? enable(newId) : disable(newId);
            }
          }),
          comboSettings: comboSettings => {
            const newCombo = setValue(comboSettings, []);
            return a.payload.value === FieldType.Number ? disable(newCombo) : enable(newCombo);
          }
        })(s);
        break;

      case editAttributesAction.ATTRIBUTES_CHANGE_UNIT:
        s = updateGroup<FormValue>({
          unit: updateGroup<EquipmentUnitViewModel>({
            name: name => {
              let newVal: string = a.payload.value.name;
              const newName = setValue(name, newVal);
              return newName;
            },
            id: id => {
              let newVal: string = a.payload.value.id;
              const newId = setValue(id, newVal);
              return newId;
            }
          })

        })(s);
        break;

      case editAttributesAction.ATTRIBUTES_ADD_COMBO_OPTIONS:
        s = updateGroup<FormValue>({
          comboSettings: comboSettings => {
            let newValue: EquipmentComboSettingsViewModel[] = [...comboSettings.value, a.payload.value];
            const newCombo = setValue(comboSettings, newValue);
            return newCombo;
          }
        })(s);
        break;

      case editAttributesAction.ATTRIBUTES_REMOVE_COMBO_OPTIONS:
        s = updateGroup<FormValue>({
          comboSettings: comboSettings => {
            let newValue: EquipmentComboSettingsViewModel[] =
              comboSettings.value.filter(c => c.value !== a.payload.value.value);
            const newCombo = setValue(comboSettings, newValue);
            return newCombo;
          }
        })(s);
        break;
    }
    return validateAndUpdateForm(s);
  }
});

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required),
  unit: updateGroup<EquipmentUnitViewModel>({
    name: validate(required)
  }),
  comboSettings: validate(required),
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;

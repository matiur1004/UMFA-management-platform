import {getSetupStepState} from '../../../reducers';
import * as setupStep from '../../bulk-equipment-wizard-reducers/setup-step.store';
import {FormValue} from '../../bulk-equipment-wizard-reducers/setup-step.store';
import {createSelector} from '@ngrx/store';
import {FormGroupState} from 'ngrx-forms';
import {Dictionary, EquipmentGroupViewModel, TemplateListItemViewModel} from '@models';

export const getFormState = createSelector(
  getSetupStepState,
  setupStep.getFormState
);

export const getEquipmentGroups = createSelector(
  getSetupStepState,
  setupStep.getEquipmentGroups
);

export const getEquipmentTemplates = createSelector(
  getSetupStepState,
  setupStep.getEquipmentTemplates
);

export const getLocations = createSelector(
  getSetupStepState,
  setupStep.getLocations
);

export const getSupplies = createSelector(
  getSetupStepState,
  setupStep.getSupplies
);

export const getFilteredDropdownData = createSelector(
  getSetupStepState,
  setupStep.getFilteredDropdownData
);

export const getEquipmentSelectedGroups = createSelector(
  getFormState,
  getEquipmentTemplates,
  getEquipmentGroups,
  (form: FormGroupState<FormValue>, equipmentTemplates: TemplateListItemViewModel[],
   equipmentGroups: EquipmentGroupViewModel[]) => {
    const templates = [...form.value.templates];
    const result: Dictionary<{ group: EquipmentGroupViewModel, devices: TemplateListItemViewModel[] }> = {};
    const selectedTemplates = templates.filter(t => t.isSelected);
    return equipmentGroups.reduce((entireObj, group) => {
      const template = selectedTemplates.find(st => st.equipmentGroupId === group.id);
      if (template) {
        const eqTemplates = equipmentTemplates.filter(st => st.equipmentGroupId === group.id);
        entireObj[template.id] = {group: group, devices: eqTemplates};
      }

      return entireObj;
    }, result);
  }
);

export const getEquipmentSelectedTotal = createSelector(
  getFormState,
  (form: FormGroupState<FormValue>) => {
    const templates = form.value.templates;

    if (!templates.length) {
      return 0;
    }

    return templates.filter(bt => bt.isSelected).length;
  }
);

export const getIsSelectedAllTemplates = createSelector(
  getFormState,
  (form) => {
    return form.value.templates.length && !form.value.templates.find(m => !m.isSelected);
  }
);

export const getEquipmentTemplateSum = createSelector(
  getFormState,
  form => {
    return form.value.templates.reduce((accT, currT) => {
      return accT + currT.numberOfEquipmentTemplate;
    }, 0);
  }
);




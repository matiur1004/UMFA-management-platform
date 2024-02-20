import {getUnitsOfMeasurementScales} from './../../../../../shared/store/selectors/common-data.selectors';
import {convertRegistersListToDictionary, getReplaceEquipmentStepState} from '../../reducers';
import * as replaceEquipmentStep from '../../reducers/replace-equipment-wizard-reducers/replace-equipment-step.store';
import {createSelector} from '@ngrx/store';

export const getFormState = createSelector(
  getReplaceEquipmentStepState,
  replaceEquipmentStep.getFormState
);

export const getRegisterFiles = createSelector(
  getReplaceEquipmentStepState,
  replaceEquipmentStep.getRegisterFiles
);

const _getEquipmentTemplates = createSelector(
  getReplaceEquipmentStepState,
  replaceEquipmentStep.getEquipmentTemplates
);

const _getSelectedTemplate = createSelector(
  getReplaceEquipmentStepState,
  replaceEquipmentStep.getSelectedTemplate
);

export const getSelectedTemplate = createSelector(
  _getSelectedTemplate,
  (template) => template
);

export const getEquipmentTemplates = createSelector(
  _getEquipmentTemplates,
  (templates) => templates
);

export const _getMeters = createSelector(
  getReplaceEquipmentStepState,
  replaceEquipmentStep.getMeters
);

export const getMeters = createSelector(
  getFormState,
  _getMeters,
  (formState, meters) => {
    if (!meters) {
      return [];
    }

    const equipmentGroup = formState.value.equipmentGroup;
    return meters.filter(m => m.equipment.equipmentGroup.supplyType === equipmentGroup.supplyType);
  }
);

export const getParentMeter = createSelector(
  getReplaceEquipmentStepState,
  getMeters,
  (formStepState, meters) => {
    const meterIds = formStepState.formState.value.parentMeters;
    if (!meterIds || !meters) {
      return null;
    }

    const meter = meters.find(m => meterIds.indexOf(m.id) !== -1);
    return meter;
  }
);

export const getNotIncludedRegisters = createSelector(
  _getSelectedTemplate,
  getFormState,
  (equipmentTemplate, formState) => {
    if (equipmentTemplate.registers) {
      const includedEquipmentTemplateIds = formState.value.registers.map(r => r.id);
      return equipmentTemplate.registers.filter(r => !includedEquipmentTemplateIds.includes(r.id));
    }

    return [];
  }
);

export const getEquipmentTemplateRegistersDict = createSelector(
  _getSelectedTemplate,
  getUnitsOfMeasurementScales,
  (template, unitOfMeasurementScale) => {
    if (template.registers) {
      return convertRegistersListToDictionary(template.registers, unitOfMeasurementScale);
    }

    return {};
  }
);

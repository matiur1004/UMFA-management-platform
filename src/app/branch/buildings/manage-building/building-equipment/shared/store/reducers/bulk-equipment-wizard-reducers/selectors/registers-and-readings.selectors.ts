import {getRegistersAndReadingsState} from '../../../reducers';
import * as registersAndReadingsStep from '../../bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import {createSelector} from '@ngrx/store';
import {getUnitsOfMeasurementScales} from 'app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import {BuildingFilter, EquipmentTemplateViewModel} from '@app/shared/models/equipment.model';
import { FilterAttribute } from '../../../../models/search-filter.model';
import {FormGroupState, removeArrayControl, updateArray, updateGroup} from 'ngrx-forms';
import {FormValue, MeterRegistersFormValue} from '../../bulk-equipment-wizard-reducers/registers-and-readings-step.store';

const getEquipmentTemplates = createSelector(
  getRegistersAndReadingsState,
  registersAndReadingsStep.getEquipmentTemplates
);

const getRegistersDictionary = (templates: EquipmentTemplateViewModel[], unitsOfMeasurementScales: any) => {
  return templates.reduce((acc, curr) => {
    acc[curr.id] = curr.registers.reduce((accReg, currReg) => {
      accReg[currReg.id] = currReg;
      accReg[currReg.id].scalesDictionary = unitsOfMeasurementScales[currReg.unitOfMeasurement];
      return accReg;
    }, {});

    return acc;
  }, {});
};

const getNotIncludedRegistersDictionary =
  (templates: EquipmentTemplateViewModel[], meters: registersAndReadingsStep.MeterRegistersFormValue[]) => {
    return meters.reduce((acc, curr) => {
      const equipmentTemplate = templates.find(m => m.id === curr.equipmentTemplateId);
      const includedRegisterIds = curr.registers.map(r => r.id);
      acc[curr.serialNumber] = equipmentTemplate.registers.filter(r => !includedRegisterIds.includes(r.id));
      return acc;
    }, {});
  };

const getFilteredEquipmentTemplates =
  (meters: registersAndReadingsStep.MeterRegistersFormValue[], equipmentTemplates: EquipmentTemplateViewModel[]) => {
    const equipmentTemplateIds = Array.from(new Set(meters.map(m => m.equipmentTemplateId)));
    return equipmentTemplates.filter(t => equipmentTemplateIds.includes(t.id));
  };

export const getFormState = createSelector(
  getRegistersAndReadingsState,
  registersAndReadingsStep.getFormState
);

export const getFilterFormState = createSelector(
  getRegistersAndReadingsState,
  registersAndReadingsStep.getFilterFormState
);

export const getRegisterFiles = createSelector(
  getRegistersAndReadingsState,
  registersAndReadingsStep.getRegisterFiles
);

export const getTotalRegisters = createSelector(
  getFormState,
  form => {
    return form.value.meters.length || 0;
  }
);

export const getSelectedRegistersCount = createSelector(
  getFormState,
  (form) => form.value.meters.filter(m => m.isSelected).length || 0
);

export const getIsSelectedAllMeters = createSelector(
  getFormState,
  (form) => {
    return form.value.meters.length && !form.value.meters.find(m => !m.isSelected);
  }
);

export const getRegisterDictionary = createSelector(
  getFormState,
  getEquipmentTemplates,
  getUnitsOfMeasurementScales,
  (form, equipmentTemplates, unitsOfMeasurementScales) => {
    return getRegistersDictionary(getFilteredEquipmentTemplates(form.value.meters, equipmentTemplates), unitsOfMeasurementScales);
  }
);

export const getNotIncludedRegisters = createSelector(
  getFormState,
  getEquipmentTemplates,
  (form, equipmentTemplates) => {
    return getNotIncludedRegistersDictionary(getFilteredEquipmentTemplates(form.value.meters, equipmentTemplates), form.value.meters);
  }
);

export const getIsSelectedOneOrMoreMeters = createSelector(
  getFormState,
  (form) => form.value.meters.length && !!form.value.meters.find(m => m.isSelected)
);

export const getFilteredFormState = createSelector(
  getFormState,
  getFilterFormState,
  (state, filter: FilterAttribute) => {
    const {category, searchTerm, supplyType, location, equipmentGroup, device} = filter;
    return updateGroup<FormValue>({
      meters: metersControl => {
        const excludedMeters = metersControl.value.filter(meter => {
          if(category == BuildingFilter.SupplyType) {
          return supplyType >= 0 && meter.supplyType !== supplyType
          } else if(category == BuildingFilter.Location) {
            return location != -1 && meter.locationId !== location
          } else if(category == BuildingFilter.EquipmentGroup) {
            return equipmentGroup != -1 && meter.equipmentGroupId !== equipmentGroup
          } else if(category == BuildingFilter.DeviceType) {
            return device != -1 && meter.deviceId !== device
          } else if(category == BuildingFilter.SerialNumber) {
            return !(meter.serialNumber.includes(searchTerm))
          } else {
            return false;
          }
        });

        excludedMeters.forEach(m => {
          const index = metersControl.value.findIndex(meterControl => meterControl.serialNumber === m.serialNumber);
          metersControl = removeArrayControl(index)(metersControl);
        });
        return metersControl;
      }
    })(state);
  });

  // meters: metersControl => {
  //   console.log('meter', metersControl.value);
  //   const excludedMeters = metersControl.value.filter(meter => {
  //     if(category == BuildingFilter.SupplyType) {
  //      return supplyType >= 0 && meter.supplyType !== supplyType
  //     } else if(category == BuildingFilter.Location) {
  //       return location != -1 && meter.locationId !== location
  //     } else if(category == BuildingFilter.EquipmentGroup) {
  //       return equipmentGroup != -1 && meter.equipmentGroupId !== equipmentGroup
  //     } else if(category == BuildingFilter.DeviceType) {
  //       return device != -1 && meter.deviceId !== device
  //     } else if(category == BuildingFilter.SerialNumber) {
  //       return !(meter.serialNumber.includes(searchTerm))
  //     } else {
  //       return false;
  //     }
  //   });

  //   excludedMeters.forEach(m => {
  //     const index = metersControl.value.findIndex(meterControl => meterControl.serialNumber === m.serialNumber);
  //     metersControl = removeArrayControl(index)(metersControl);
  //   });

  //   return metersControl;
  // }
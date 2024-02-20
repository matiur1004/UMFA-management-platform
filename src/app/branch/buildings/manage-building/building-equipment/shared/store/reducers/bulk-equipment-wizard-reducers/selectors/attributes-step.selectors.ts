import {getAttributesStepState} from '../../../reducers';
import * as attributesStep from '../../bulk-equipment-wizard-reducers/attributes-step.store';
import {EquipmentGroupMetersFormValue, FormValue} from '../../bulk-equipment-wizard-reducers/attributes-step.store';
import {createSelector} from '@ngrx/store';
import {FormGroupState, removeArrayControl, updateArray, updateGroup} from 'ngrx-forms';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';
import { BuildingFilter } from '@app/shared/models';

export const getFormState = createSelector(
  getAttributesStepState,
  attributesStep.getFormState
);

export const getFilterFormState = createSelector(
  getAttributesStepState,
  attributesStep.getFilterFormState
);

export const getTotalAttributes = createSelector(
  getAttributesStepState,
  form => {
    return form.formState.value.equipmentGroupMeters.reduce((accT, currT) => {
      const meters = currT.meters.length;

      return accT + meters;
    }, 0);
  }
);

export const getFilteredFormState = createSelector(
  getFormState,
  getFilterFormState,
  (state, filter: FilterAttribute) => {
    const {category, searchTerm, supplyType, location, equipmentGroup, device} = filter;
    return updateGroup<FormValue>({
      equipmentGroupMeters: updateArray<EquipmentGroupMetersFormValue>(updateGroup<EquipmentGroupMetersFormValue>({
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
      }))
    })(state);
  });

export const getSelectedAllMeters = createSelector(
  getFormState,
  (form) => {
    return form.value.equipmentGroupMeters.reduce((acc, curr) => {
      acc[curr.equipmentGroupId] = curr.meters.length && !curr.meters.find(m => !m.isSelected);
      return acc;
    }, {});
  }
);

export const getSelectedOneOrMoreMeters = createSelector(
  getFormState,
  (form) => {
    return form.value.equipmentGroupMeters.reduce((acc, curr) => {
      acc[curr.equipmentGroupId] = !!curr.meters.find(m => m.isSelected);
      return acc;
    }, {});
  }
);

export const getSelectedAttributeMeters = createSelector(
  getFormState,
  (form: FormGroupState<attributesStep.FormValue>) => {
    return form.value.equipmentGroupMeters.reduce((acc, group) => {
      const countMeters = group.meters.filter(m => m.isSelected).length;

      return acc + countMeters;
    }, 0);
  }
);

export const getActions = createSelector(
  getFormState,
  form => (action: any) => {
    const newActions = {};
    form.value.equipmentGroupMeters.forEach(g => {
      newActions[g.equipmentGroupId] = {};
      if (action && Object.keys(action).includes(g.equipmentGroupId)) {
        newActions[g.equipmentGroupId]['filteredActions'] = g.headerAttributes;
        const selectedAction = g.headerAttributes.find(h => h.id === action[g.equipmentGroupId]?.id);
        newActions[g.equipmentGroupId]['selectedAction'] = (selectedAction) ? 'Set ' + selectedAction.name : null;
      } else {
        newActions[g.equipmentGroupId]['filteredActions'] = g.headerAttributes.filter(h => h.id !== g.headerAttributes[0].id);
        newActions[g.equipmentGroupId]['selectedAction'] = 'Set ' + g.headerAttributes[0].name;
      }
    });

    return newActions;
  }
);

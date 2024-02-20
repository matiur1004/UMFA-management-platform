import {getEquipmentList, getShopsStepState, getShopStepMeters} from '../../../reducers';
import * as shopsStep from '../../bulk-equipment-wizard-reducers/shops-step.store';
import {LocationGroupMetersFormValue} from '../../bulk-equipment-wizard-reducers/shops-step.store';
import {createSelector} from '@ngrx/store';
import {BulkDropdownType, getTreeChildrenIds, getTreesLookup, MeterViewModel} from '../../../../models';
import {BuildingFilter, Dictionary, UnitType} from '@models';
import {FormGroupState, removeArrayControl, unbox, updateArray, updateGroup} from 'ngrx-forms';
import {FormValue, UnitMetersFormValue} from '../shops-step.store';
import {getMeterName} from '../../../utilities/get-meter-name-func';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';

export const getFormState = createSelector(
  getShopsStepState,
  shopsStep.getFormState
);

export const getMeterDropdownData = createSelector(
  getShopsStepState,
  shopsStep.getMeterDropdownData
);

export const getFilterForm = createSelector(
  getShopsStepState,
  shopsStep.getFilterForm
);

export const getFilteredFormState = createSelector(
  getFormState,
  getFilterForm,
  (state, filter: FilterAttribute) => {
    const {category, searchTerm, supplyType, location, equipmentGroup, device} = filter;
    return updateGroup<FormValue>({
      locationGroupMeters: updateArray<LocationGroupMetersFormValue>(updateGroup<LocationGroupMetersFormValue>({
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
  }
);

export const getShopTotal = createSelector(
  getFormState,
  form => {
    return form.value.locationGroupMeters.reduce((accT, currT) => {
      const meters = currT.meters.length;

      return accT + meters;
    }, 0);
  }
);


export const getIsSelectedAllMeters = createSelector(
  getFormState,
  form => !form.value.locationGroupMeters.find(gm => !!gm.meters.find(m => !m.isSelected))
);

const _getShops = createSelector(
  getShopsStepState,
  shopsStep.getShops
);

const _getCommonAreas = createSelector(
  getShopsStepState,
  shopsStep.getCommonAreas
);

export const getUnitOptions = createSelector(
  _getShops,
  _getCommonAreas,
  (shops, commonAreas) => [
    ...shops.map(s => ({...s, unitType: UnitType.Shop})),
    ...commonAreas.map(s => ({...s, unitType: UnitType.CommonArea}))]
);

export const getTotalSelected = createSelector(
  getFormState,
  (form: FormGroupState<FormValue>) => {
    return form.value.locationGroupMeters.reduce((acc, group) => {
      const countMeters = group.meters.filter(m => m.isSelected).length;

      return acc + countMeters;
    }, 0);
  }
);

export const getIsSelectedMetersByOneGroup = createSelector(
  getFormState,
  (form) => {
    const meters = getMeters(form);
    const firstSelectedMeter = meters.find(m => m.isSelected);
    const isSelected = firstSelectedMeter && !meters.find(m => m.isSelected && m.equipmentGroupId !== firstSelectedMeter.equipmentGroupId);

    return {
      isSelected: isSelected,
      equipmentGroupId: isSelected ? firstSelectedMeter.equipmentGroupId : null,
      supplyType: isSelected ? firstSelectedMeter.supplyType : null
    };
  }
);

export const getIsSelectedOneOrMoreMeters = createSelector(
  getFormState,
  form => !!form.value.locationGroupMeters.find(gm => !!gm.meters.find(m => m.isSelected))
);

export const getSupplies = createSelector(
  getFormState,
  getMeterDropdownData,
  getIsSelectedMetersByOneGroup,
  (form, dropdownData, isSelectedMetersByOneGroup) => {
    if (isSelectedMetersByOneGroup.isSelected) {

      const meters = getMeters(form);
      const meterId = meters.find(m => m.equipmentGroupId === isSelectedMetersByOneGroup.equipmentGroupId).id;
      const suppliesTo = [...dropdownData[meterId][BulkDropdownType.Supplies]];

      return suppliesTo;
    } else {
      return [];
    }
  }
);

const getMeters = (form: FormGroupState<FormValue>): UnitMetersFormValue[] => {
  return form.value.locationGroupMeters.reduce((acc, curr) => {
    return acc.concat(curr.meters);
  }, []);
};

export const getExistMeters = createSelector(
  getEquipmentList,
  (existingMeters: MeterViewModel[]) => {
    return existingMeters
      .map(m => ({
        name: getMeterName(m.serialNumber, m.supplyType),
        id: m.id,
        supplyType: m.supplyType,
        parentMeters: []
      }));
  }
);

export const getNewMeters = createSelector(
  getShopStepMeters,
  (newMeters: shopsStep.UnitMetersFormValue[]) => {
    return newMeters
      .map(m => ({
        name: getMeterName(m.serialNumber, m.supplyType),
        id: m.id,
        supplyType: m.supplyType,
        parentMeters: unbox(m.parentMeters)
      }));
  }
);

export const getSelectedGroupsParents = createSelector(
  getFormState,
  getExistMeters,
  getNewMeters,
  (form, existMeters, newMeters) => {
    const entireObj: Dictionary<{ groupName: string, parentMeters: MeterViewModel[] }> = {};

    form.value.locationGroupMeters.forEach(lg => {
      let metersExists = [];
      lg.meters.forEach(m => {
        metersExists = [...existMeters].filter(e => e.supplyType === m.supplyType);
        const metersNew = newMeters.length && newMeters.filter(e => e.supplyType === m.supplyType);
        const treesLookup = getTreesLookup([...metersNew]);
        const meterTree = treesLookup[m.id];
        const meterChildrenIds = getTreeChildrenIds(meterTree);
        const filteredNewMeters = newMeters.filter(e => e.id !== m.id && !meterChildrenIds.has(e.id));
        metersExists.concat(filteredNewMeters);

        entireObj[m.equipmentGroupId] = {groupName: m.equipmentGroupName, parentMeters: metersExists};
      });
    });

    return entireObj;
  }
);

export const getSelectedGroupsLocationAndSupply = createSelector(
  getFormState,
  getMeterDropdownData,
  (form, dropdownData) => {
    const entireObj: Dictionary<{ groupName: string, supplyTypes: Array<any> }> = {};

    form.value.locationGroupMeters.forEach(lg => {
      const meters = lg.meters.filter(m => m.isSelected);
      meters.forEach(m => {
        if (!entireObj[m.equipmentGroupId]) {
          const meterId = m.id;
          const suppliesTo = [...dropdownData[meterId][BulkDropdownType.Supplies]];
          entireObj[m.equipmentGroupId] = {groupName: m.equipmentGroupName, supplyTypes: suppliesTo};
        }
      });
    });

    return entireObj;
  }
);

export const getUnselectedMeters = createSelector(
  getEquipmentList,
  getShopStepMeters,
  getIsSelectedMetersByOneGroup,
  (existingMeters: any[], newMeters: any[], isSelectedMetersByOneGroup) => {
    if (!isSelectedMetersByOneGroup.isSelected) {
      return [];
    }
    return existingMeters.concat(newMeters.filter(m => !m.isSelected))
      .filter(m => m.supplyType === isSelectedMetersByOneGroup.supplyType)
      .map(m => ({
        name: getMeterName(m.serialNumber, m.supplyType),
        id: m.id,
        supplyType: m.supplyType,
        parentMeters: []
      }));
  }
);

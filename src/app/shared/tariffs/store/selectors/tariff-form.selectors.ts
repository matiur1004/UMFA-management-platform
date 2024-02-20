import {createSelector, MemoizedSelector} from '@ngrx/store';

import * as tariffFromStore from '../reducers/tariff-form.store';
import {
  AmrUnits,
  chargingTypes,
  nonElectricityChargingTypes,
  OrderVersion,
  SupplyType,
  UnitOfMeasurement
} from '@models';
import {sortRule} from '@shared-helpers';


const sortTariffVersions = (tariffVersions: any[], order: number, valueOrder: string) => {
  tariffVersions = [...tariffVersions];
  switch (order) {
    case OrderVersion.ValuesAsc:
      return tariffVersions.sort((a, b) => sortRule(a[valueOrder], b[valueOrder]));
    case OrderVersion.ValuesDesc:
      return tariffVersions.sort((a, b) => sortRule(b[valueOrder], a[valueOrder]));
    case OrderVersion.CreatedAsc:
      return tariffVersions.sort((a, b) => sortRule(a.createdOn, b.createdOn));
    case OrderVersion.CreatedDesc:
      return tariffVersions.sort((a, b) => sortRule(b.createdOn, a.createdOn));
    case OrderVersion.CreatedByAsc:
      return tariffVersions.sort((a, b) => sortRule(a.createdByUser.fullName, b.createdByUser.fullName));
    case OrderVersion.CreatedByDesc:
      return tariffVersions.sort((a, b) => sortRule(b.createdByUser.fullName, a.createdByUser.fullName));
    case OrderVersion.UpdatedAsc:
      return tariffVersions.sort((a, b) => sortRule(a.updatedOn, b.updatedOn));
    case OrderVersion.UpdatedDesc:
      return tariffVersions.sort((a, b) => sortRule(b.updatedOn, a.updatedOn));
    case OrderVersion.UpdatedByAsc:
      return tariffVersions.sort((a, b) => sortRule(a.updatedByUser.fullName, b.updatedByUser.fullName));
    case OrderVersion.UpdatedByDesc:
      return tariffVersions.sort((a, b) => sortRule(b.updatedByUser.fullName, a.updatedByUser.fullName));
    default:
      return tariffVersions;
  }
};

const getLineItems = (array) => {
  return array.map(l => {
    return {lineItemId: l.id, name: l.name, chargingType: l.chargingType};
  });
};

export const getTariffFormSelectors = (
  getTariffFormState: MemoizedSelector<Object, tariffFromStore.State>,
  getUnitsOfMeasurement: MemoizedSelector<Object, UnitOfMeasurement[]>
) => {

  const getTariffForm = createSelector(
    getTariffFormState,
    state => state.formState
  );

  const getAllUnitsOfMeasurements = createSelector(
    getUnitsOfMeasurement,
    (units: UnitOfMeasurement[]) => units
  );

  const getAllAMRUnits = createSelector(
    getUnitsOfMeasurement,
    (units: UnitOfMeasurement[]) => {
      return [...units].filter(u => u.unitType === AmrUnits[u.defaultName]
      );
    }
  );

  const getTariffFormLineItems = createSelector(
    getTariffForm,
    (form) => {
      let lineItems = getLineItems(form.value.basedOnAttributesLineItems);
      lineItems = lineItems.concat(getLineItems(form.value.basedOnReadingsAndSettingsLineItems));
      lineItems = lineItems.concat(getLineItems(form.value.basedOnReadingsLineItems));
      lineItems = lineItems.concat(getLineItems(form.value.fixedPriceLineItems));
      lineItems = lineItems.concat(getLineItems(form.value.basedOnCalculationsLineItems));
      return lineItems;
    }
  );

  const getTariffFormSupplyType = createSelector(
    getTariffForm,
    (form) => {
      return form.value.supplyType;
    }
  );

  const getChargingTypes = createSelector(
    getTariffFormSupplyType,
    (supplyType) => {
      return (supplyType === SupplyType.Electricity) ? chargingTypes : nonElectricityChargingTypes;
    }
  );
  const getFilteredUnitsOfMeasurement = createSelector(
    getTariffFormSupplyType,
    getUnitsOfMeasurement,
    (supplyType, units) => {
      const rr = units.filter(r => r.supplyTypes.findIndex(s => s === supplyType) >= 0);

      return rr;
    }
  );

  return {
    getChargingTypes,
    getTariffFormSupplyType,
    getTariffFormLineItems,
    getTariffForm,
    getUnitsOfMeasurement,
    getAllUnitsOfMeasurements,
    getAllAMRUnits,
    getFilteredUnitsOfMeasurement,
  };
};


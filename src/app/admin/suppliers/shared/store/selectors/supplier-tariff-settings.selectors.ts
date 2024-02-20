import {createSelector} from '@ngrx/store';

import {getAttributes, getRegisters, getTariffCategoriesState, getTariffStepsState} from './common.selectors';
import {getSuppliersSupplyTypes} from './supplier.selectors';
import {getUnitsOfMeasurement} from 'app/admin/shared/common-data/store/selectors';
import {FieldType} from '@models';

export const getTariffCategoriesFormState = createSelector(getTariffCategoriesState, state => state.formState);
export const getTariffStepsFormState = createSelector(getTariffStepsState, state => state.formState);

export const getSupplierEquipmentRegisters = createSelector(getRegisters, getSuppliersSupplyTypes,
  (registers, supplyTypes) => registers.filter(r => r.supplyTypes.findIndex(t => supplyTypes.indexOf(t) >= 0) >= 0));

export const getSupplierUnitsOfMeasurement = createSelector(getUnitsOfMeasurement, getSuppliersSupplyTypes,
  (units, supplyTypes) => units.filter(r => r.supplyTypes.findIndex(t => supplyTypes.indexOf(t) >= 0) >= 0));

export const getSystemAttributes = createSelector(
  getAttributes,
  attributes => attributes.filter(a => a.isSystem)
);

export const getAttributesComboValues = createSelector(
  getAttributes,
  attributes =>
    (attributes || [])
      .filter(a => a.fieldType === FieldType.Combo)
      .reduce((agg, curr) => {
        agg[curr.id] = curr.comboSettings;
        return agg;
      }, {})
);

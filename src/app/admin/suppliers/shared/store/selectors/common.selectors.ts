import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from '../reducers';


const _getState = createFeatureSelector<State>('supplier');

export const getSupplierFormState = createSelector(
  _getState,
  state => state.supplierInfoForm
);

export const getCommonState = createSelector(
  _getState,
  state => state.commonData
);

export const getSupplierState = createSelector(
  _getState,
  state => state.supplier
);

export const getCreateSupplierState = createSelector(
  _getState,
  state => state.createSupplierForm
);

export const getTariffCategoriesState = createSelector(
  _getState,
  state => state.tariffCategories
);

export const getTariffStepsState = createSelector(
  _getState,
  state => state.steps
);

export const getTariffState = createSelector(
  _getState,
  state => state.tariff
);

export const getTariffFormState = createSelector(
  _getState,
  state => state.tariffForm
);

export const getSupplierTariffCategories = createSelector(
  getSupplierState,
  state => state.tariffCategories
);

export const getTariffValuesState = createSelector(
  _getState,
  state => state.tariffValues
);

export const getTariffValuesFormState = createSelector(
  _getState,
  state => state.tariffValuesForm
);

export const getRegisters = createSelector(
  _getState,
  state => state.registers
);

export const getBuildingCategories = createSelector(
  _getState,
  state => state.buildingCategories
);

export const getAttributes = createSelector(
  _getState,
  state => state.attributes
);

export const getTariffVersionsState = createSelector(
  _getState,
  state => state.tariffVersions
);

export const getTariffSettings = createSelector(
  _getState,
  state => state.tariffSettings
);

export const getTariffVersionSettings = createSelector(
  _getState,
  state => state.tariffVersionSettings
);

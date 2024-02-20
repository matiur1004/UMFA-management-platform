import {createSelector} from '@ngrx/store';

import {getAddNewTariffBuilding} from './building-tariffs.selectors';

export const selectAddNewTariffBuildingSuppliers = createSelector(getAddNewTariffBuilding, (state) => state.suppliers);
export const selectAddNewTariffBranchCategories = createSelector(getAddNewTariffBuilding, (state) => state.categories);
export const selectAddNewTariffBuildingFormState = createSelector(getAddNewTariffBuilding, (state) => state.formState);
export const selectAddNewTariffBuildingCompleted = createSelector(getAddNewTariffBuilding, (state) => state.completed);

export const selectBranchTariffs = createSelector(getAddNewTariffBuilding, (state) => state.branchTariffs);
export const selectBranchTariffsFiltered = createSelector(getAddNewTariffBuilding, (state) => state.branchTariffsFiltered);
export const selectBranchTariffsOrder = createSelector(getAddNewTariffBuilding, (state) => state.tariffOrder);

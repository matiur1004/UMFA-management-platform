import {createSelector} from '@ngrx/store';

import {getAllocatedTariffsState} from './building-tariffs.selectors';

export const selectBuildingTariffs = createSelector(getAllocatedTariffsState, (state) => state.entities);
export const selectBuildingTariffsFiltered = createSelector(getAllocatedTariffsState, (state) => state.filteredEntities);
export const selectBuildingTariffsOrder = createSelector(getAllocatedTariffsState, (state) => state.order);
export const selectBuildingTariffsSupplyTypeFilter = createSelector(getAllocatedTariffsState, (state) => state.supplyTypeFilter);
export const selectBuildingTariffsSupplierFilter = createSelector(getAllocatedTariffsState, (state) => state.supplierFilter);
export const selectBuildingData = createSelector(getAllocatedTariffsState, (state) => state.buildingData);
export const selectBuildingHistories = createSelector(getAllocatedTariffsState, (state) => state.buildingHistories);

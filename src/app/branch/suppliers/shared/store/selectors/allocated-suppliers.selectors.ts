import {createSelector} from '@ngrx/store';

import {getAllocatedSuppliersState} from '../reducers';

export const selectAllocatedSuppliersEntities = createSelector(getAllocatedSuppliersState, (state) => state.entities);
export const selectAllocatedSuppliersList = createSelector(getAllocatedSuppliersState, (state) => state.suppliersList);
export const selectAllocatedSuppliersOrder = createSelector(getAllocatedSuppliersState, (state) => state.order);
export const selectAllocatedSuppliersFilter = createSelector(getAllocatedSuppliersState, (state) => state.filter);
export const selectBranchId = createSelector(getAllocatedSuppliersState, (state) => state.branchId);


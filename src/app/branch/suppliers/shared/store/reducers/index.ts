import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromAllocatedReducers from './allocated-suppliers.reducer';
import * as fromAddNewSupplierBranch from './add-new-supplier-branch.reducer';

export interface State {
  allocatedSuppliers: fromAllocatedReducers.State;
  addNewSupplierBranch: fromAddNewSupplierBranch.State;
}

export const reducers: ActionReducerMap<State> = {
  allocatedSuppliers: fromAllocatedReducers.reducer,
  addNewSupplierBranch: fromAddNewSupplierBranch.reducer,
};

export const getSuppliersState = createFeatureSelector<State>(
  'suppliers'
);

export const getAllocatedSuppliersState = createSelector(
  getSuppliersState,
  (state: State) => state.allocatedSuppliers
);

export const getAddNewSupplierBranchState = createSelector(
  getSuppliersState,
  (state: State) => state.addNewSupplierBranch
);

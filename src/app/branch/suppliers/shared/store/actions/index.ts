import {AllocatedSuppliersActions} from './allocated-suppliers.actions';
import {AddNewSupplierBranchActions} from './add-new-supplier-branch.actions';

export type Actions =
  | AllocatedSuppliersActions
  | AddNewSupplierBranchActions;

export * from './allocated-suppliers.actions';
export * from './add-new-supplier-branch.actions';

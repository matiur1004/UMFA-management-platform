import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {FormGroupState, ResetAction, SetValueAction} from 'ngrx-forms';

import {BranchModel, DropdownItem, SupplierViewModel, SupplyType, SupplyTypeText} from '@models';
import {BranchManagerService} from '@services';
import * as fromSelectors from '../../shared/store/selectors';
import * as fromStore from '../../shared/store';
import * as fromReducer from '../../shared/store/reducers/add-new-supplier-branch.reducer';

@Component({
  selector: 'add-supplier-to-branch',
  templateUrl: './add-supplier-to-branch.component.html',
  styleUrls: ['./add-supplier-to-branch.component.less']
})
export class AddSupplierToBranchComponent implements OnInit, OnDestroy {

  destroyed$ = new Subject();

  suppliers$: Observable<SupplierViewModel[]>;
  fromState$: Observable<FormGroupState<fromReducer.FormValue>>;
  completed$: Observable<boolean>;

  supplyTypes: DropdownItem[];
  defaultSelectedSupplyType: DropdownItem = {
    label: 'All',
    value: null
  };
  selectedSupplyType: DropdownItem = this.defaultSelectedSupplyType;

  currentBranch: BranchModel;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly activeModal: NgbActiveModal,
    private readonly branchManagerService: BranchManagerService
  ) {
  }

  getSupplyTypeItems(): DropdownItem[] {
    const newArr = Object.keys(SupplyType)
      .filter(key => isNaN(SupplyType[key]))
      .map((item, index) => ({
        label: SupplyTypeText[+item],
        value: index
      }));
    return [this.defaultSelectedSupplyType, ...newArr];
  }

  resetForm(): void {
    this.store.dispatch(new SetValueAction(fromReducer.FORM_ID, fromReducer.initialFormState));
    this.store.dispatch(new ResetAction(fromReducer.FORM_ID));
  }

  onChangeSupplyType(item: DropdownItem): void {
    this.selectedSupplyType = item;
    this.resetForm();
    this.store.dispatch(new fromStore.GetSuppliers(item.value));
  }

  onSave(ids: string[]): void {
    if (!ids) return null;
    const branchId: string = this.currentBranch.id;
    this.store.dispatch(new fromStore.AddNewSupplierBranch({branchId, ids}));
  }

  onDismiss(): void {
    this.activeModal.dismiss();
    this.resetForm();
  }

  ngOnInit() {
    this.currentBranch = this.branchManagerService.getCurrentBranch();
    this.supplyTypes = this.getSupplyTypeItems();
    this.suppliers$ = combineLatest(
      this.store.pipe(select(fromSelectors.selectSuppliers)),
      this.store.pipe(select(fromSelectors.selectAllocatedSuppliersEntities))
    ).pipe(
      filter(([allSuppliers, allocatedSuppliers]) => !!(allSuppliers && allocatedSuppliers)),
      map(
        ([allSuppliers, allocatedSuppliers]) =>
          allSuppliers.filter((supplier) => !allocatedSuppliers.find((item) => item.id === supplier.id))
      )
    );

    this.fromState$ = this.store.pipe(
      select(fromSelectors.selectFormState)
    );

    this.completed$ = this.store.pipe(
      select(fromSelectors.selectCompleted)
    );

    this.completed$.pipe(
      filter(c => !!c),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.activeModal.close();
      this.store.dispatch(new fromStore.PurgeAddNewSupplierBranchStore());
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}

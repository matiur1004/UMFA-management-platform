import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormGroupState, ResetAction, SetValueAction, unbox} from 'ngrx-forms';
import {filter, takeUntil} from 'rxjs/operators';

import {AddBuildingTariffViewModel, BranchModel, CategoryViewModel, SupplyTypeDropdownItems} from '@models';
import {getActiveDropdownItemFromList, setDescOrAsc} from '@shared-helpers';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

import * as fromStore from '../../store';
import * as fromSelectors from '../../store/selectors';
import * as fromReducer from '../../store/reducers/add-new-tariff-building.reducer';
import * as fromAllocatedTariffs from '../../store/actions/allocated-tariffs.actions';

@Component({
  selector: 'add-new-allocated-tariff',
  templateUrl: './add-new-allocated-tariff.component.html',
  styleUrls: ['./add-new-allocated-tariff.component.less']
})
export class AddNewAllocatedTariffComponent implements OnInit {

  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() isSaveOutside: boolean = false;

  subscriber$: Subscription;
  destroyed$ = new Subject();

  selectedSupplyType: string = '';
  supplyTypes = SupplyTypeDropdownItems;
  suppliers$: Observable<any[]>;
  selectedSupplier = '';

  categories$: Observable<CategoryViewModel[]>;
  selectedCategory: string[] = [];

  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  completed$: Observable<boolean>;
  currentBranch$: Observable<BranchModel>;

  branchTariffs$: Observable<AddBuildingTariffViewModel[]>;

  branchTariffsOrder$: Observable<number>;

  supplyTypeFilter$: Observable<number>;
  supplierFilter$: Observable<string>;
  buildingCategoriesFilter$: Observable<string[]>;

  getActiveDropdownItemFromList = getActiveDropdownItemFromList;

  constructor(
    private store: Store<fromStore.State>,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new fromStore.GetBranchesAllCategories());
    this.store.dispatch(new fromStore.GetBranchTariffs());
    this.store.dispatch(new fromAllocatedTariffs.GetBuildingData(this.buildingId));
    this.store.dispatch(new fromStore.GetBranchSuppliers(this.branchId));

    this.formState$ = this.store.pipe(
      select(fromSelectors.selectAddNewTariffBuildingFormState)
    );

    this.suppliers$ = this.store.pipe(select(fromSelectors.selectAddNewTariffBuildingSuppliers));

    this.categories$ = this.store.pipe(select(fromSelectors.selectAddNewTariffBranchCategories));
    this.branchTariffs$ = this.store.pipe(select(fromSelectors.selectBranchTariffsFiltered));
    this.branchTariffsOrder$ = this.store.pipe(select(fromSelectors.selectBranchTariffsOrder));
    this.completed$ = this.store.pipe(select(fromSelectors.selectAddNewTariffBuildingCompleted));

    this.completed$.pipe(
      filter(c => !!c),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.activeModal.close();
      this.store.dispatch(new fromStore.PurgeAddNewTariffBuilding());
    });

    this.branchTariffs$ = this.store.pipe(select(fromSelectors.selectBranchTariffsFiltered));
  }

  resetForm(): void {
    this.store.dispatch(new SetValueAction(fromReducer.FORM_ID, fromReducer.initialFormState));
    this.store.dispatch(new ResetAction(fromReducer.FORM_ID));
  }

  onChangeSupplyType(supplyType: string): void {
    this.selectedSupplyType = supplyType;
    this.onChangeSupplier('');
  }

  onChangeSupplier(supplierId: string): void {
    this.selectedSupplier = supplierId;
    this.onChangeBuildingCategory([]);
  }

  onChangeBuildingCategory(value: CategoryViewModel[]): void {
    this.selectedCategory = value.map(item => item.id);
  }

  onAddTariff(tariffId: string): void {
    this.store.dispatch(new fromStore.SelectBuildingTariff(tariffId));
  }

  onTariffOrder(index: number, currentOrderIndex: number): void {
    const newOrderIndex = setDescOrAsc(currentOrderIndex, index);
    this.store.dispatch(new fromStore.SetBranchTariffsOrder(newOrderIndex));
  }

  onSave(form: FormGroupState<fromReducer.FormValue>): void {
    if (form.isInvalid) return null;
    const {tariffs} = form.value;

    if (this.isSaveOutside) {
      this.activeModal.close(unbox(tariffs));
      return null;
    }

    this.activeModal.dismiss();

    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new fromStore.AddNewTariffBuilding({
        comment: comment,
        date: date,
        actionType: actionType,
        entity: unbox(tariffs)
      }));
    }, () => {
      const newModalRef = this.modalService.open(AddNewAllocatedTariffComponent, {
        backdrop: 'static',
        windowClass: 'add-new-tariff-building-modal'
      });
      newModalRef.componentInstance.branchId = this.branchId;
      newModalRef.componentInstance.buildingId = this.buildingId;
      newModalRef.componentInstance.isSaveOutside = this.isSaveOutside;
    });
  }

  onDismiss(): void {
    this.resetForm();
    this.activeModal.dismiss();
  }
}

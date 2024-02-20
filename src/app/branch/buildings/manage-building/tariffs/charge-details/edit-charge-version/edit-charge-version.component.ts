import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroupState} from 'ngrx-forms';
import {select, Store} from '@ngrx/store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

import {RegisterViewModel, SupplyTypeDropdownItems} from '@models';
import {ChargeLineItemChargingType, OrderVersion} from '../../../shared/models';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

import * as fromStore from '../../store';
import * as fromReducer from '../../store/reducers/edit-charge-version.reducer';
import {AddChargeLineItemComponent} from '../../dialogs/add-charge-line-item/add-charge-line-item.component';
import {AddNewChargeValueComponent} from '../../dialogs/add-new-charge-value/add-new-charge-value.component';


@Component({
  selector: 'edit-charge-version',
  templateUrl: './edit-charge-version.component.html',
  styleUrls: ['./edit-charge-version.component.less']
})
export class EditChargeVersionComponent implements OnInit {

  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  registers$: Observable<RegisterViewModel[]>;
  valuesVersions$: Observable<any>;
  valuesVersionOrder$: Observable<OrderVersion>;

  SupplyTypeDropdownItems = SupplyTypeDropdownItems;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }

  onAddLineItem(): void {
    this.modalService.open(AddChargeLineItemComponent, {backdrop: 'static', windowClass: 'add-charge-line-item'});
  }

  onSave(isValid: boolean, chargeId: string, model: any): void {
    if (!isValid) {
      return null;
    }

    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new fromStore.UpdateChargeVersion({
        chargeId,
        comment: comment,
        date: date,
        actionType: actionType,
        entity: model
      }));
    }, () => {
    });
  }

  onCancel(): void {
    this.router.navigate(['../../allocated-tariffs'], {relativeTo: this.route});
  }

  onDeleteLineItem(payload: { id: string, chargingType: ChargeLineItemChargingType }): void {
    this.store.dispatch(new fromStore.DeleteChargeLineItem(payload));
  }

  onUpdateChargingType(
    payload: {
      id: string,
      newChargingType: ChargeLineItemChargingType,
      oldChargingType: ChargeLineItemChargingType
    }) {
    this.store.dispatch(new fromStore.UpdateTypeChargeLineItem(payload));
  }

  onChangeValueVersionOrder(order: OrderVersion): void {
    this.store.dispatch(new fromStore.SetChargeValueVersionsOrder(order));
  }

  onAddValueVersion(chargeId: string): void {
    this.store.dispatch(new fromStore.CreateNewChargeValueInit({lineitem: null}));
    const modal = this.modalService.open(AddNewChargeValueComponent, {
      backdrop: 'static',
      windowClass: 'add-charge-value'
    });
    modal.componentInstance.chargeId = chargeId;
  }

  onEditValueVersion(value: any): void {
    this.router.navigate(['value', value.id], {relativeTo: this.route});
  }

  trackByFn(index: number) {
    return index;
  }

  ngOnInit() {
    this.formState$ = this.store.pipe(select(fromStore.selectEditChargeVersionFormState));
    this.registers$ = this.store.pipe(select(fromStore.selectEditChargeVersionRegisters));
    this.valuesVersions$ = this.store.pipe(select(fromStore.selectEditChargeValuesVersions));
    this.valuesVersionOrder$ = this.store.pipe(select(fromStore.selectEditChargeValuesVersionsOrder));
  }
}

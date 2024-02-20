import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {getActiveOrderClass, getOrderClasses} from '@shared-helpers';
import {ChargesListOrder, ChargeViewModel} from '../../../shared/models';
import {AddNewChargeValueComponent} from '../../dialogs/add-new-charge-value/add-new-charge-value.component';

import * as fromStore from '../../store';

@Component({
  selector: 'additional-charges-list',
  templateUrl: './additional-charges-list.component.html',
  styleUrls: ['./additional-charges-list.component.less']
})
export class AdditionalChargesListComponent implements OnInit {

  @Input() charges: ChargeViewModel[] = [];
  @Input() buildingPeriodIsFinalized: boolean;
  order$: Observable<ChargesListOrder>;

  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;

  public buildingId: string;

  ChargesListOrder = ChargesListOrder;
    
  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.order$ = this.store.pipe(select(fromStore.selectAdditionalChargesOrder));
  }

  onChangeChargeOrder(order: ChargesListOrder): void {
    this.store.dispatch(new fromStore.SetAdditionalChargeOrder(order));
  }

  onEditCharge(charge: any): void {
    this.router.navigate(['../charge', charge.id], {relativeTo: this.route});
  }

  onDeleteCharge(charge: any): void {
    this.store.dispatch(new fromStore.DeleteAdditionalChargeVersion(charge.id));
  }

  onEditValue({charge, value}): void {
    this.router.navigate(['../charge', charge.id, 'value', value.id], {relativeTo: this.route});
  }

  onAddNewValue({charge, value}): void {
    const lineItems = [...charge.basedOnReadingsLineItems, ...charge.fixedPriceLineItems];
    const baseAdditionalChargeValueId = value ? value.id : null;
    this.store.dispatch(new fromStore.CreateNewChargeValueInit({lineItems, baseAdditionalChargeValueId}));
    const modal = this.modalService.open(AddNewChargeValueComponent, {
      backdrop: 'static',
      windowClass: 'add-charge-value'
    });
    modal.componentInstance.chargeId = charge.id;
  }

  onDeleteValue({charge, value}): void {
    this.store.dispatch(new fromStore.DeleteAdditionalChargeValue({chargeId: charge.id, valueId: value.id}));
  }

  trackByFn(index: number) {
    return index;
  }
}

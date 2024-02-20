import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil, tap, withLatestFrom} from 'rxjs/operators';

import * as fromStore from '../../store';
import * as fromReducer from '../../store/reducers/add-charge-line-item.store';

import {ChargeLineItemChargingTypeDropdownItems} from '../../../shared/models';

@Component({
  selector: 'add-charge-line-item',
  templateUrl: './add-charge-line-item.component.html',
  styleUrls: ['./add-charge-line-item.component.less']
})
export class AddChargeLineItemComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  trySubmit = new Subject();
  destroyed$ = new Subject();

  chargingTypes = ChargeLineItemChargingTypeDropdownItems;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly store: Store<fromStore.State>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new fromStore.ResetIsComplete());
    this.formState$ = this.store.pipe(select(fromStore.selectAddChargeLineItemFromState));

    this.store.pipe(
      select(fromStore.selectAddChargeLineItemIsComplete),
      takeUntil(this.destroyed$),
      tap(isComplete => {
        if (isComplete) {
          this.activeModal.close();
        }
      })
    ).subscribe();

    this.trySubmit.pipe(
      withLatestFrom(this.formState$),
      takeUntil(this.destroyed$)
    ).subscribe(([_, form]) => {
      if (form.isValid) {
        this.store.dispatch(new fromStore.CreateLineItem(form.value));
        this.reset();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(fromReducer.FORM_ID));
    this.trySubmit.next();
  }

  reset() {
    this.store.dispatch(new SetValueAction(fromReducer.FORM_ID, fromReducer.InitState.value));
    this.store.dispatch(new ResetAction(fromReducer.FORM_ID));
  }

  dismiss() {
    this.reset();
    this.activeModal.dismiss();
  }
}

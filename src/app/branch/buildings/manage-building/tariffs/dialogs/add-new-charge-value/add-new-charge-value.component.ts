import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {takeUntil, tap, withLatestFrom} from 'rxjs/operators';

import * as fromStore from '../../store';
import * as fromReducer from '../../store/reducers/add-new-charge-value.store';

import {NgbDateFRParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

@Component({
  selector: 'add-new-charge-value',
  templateUrl: './add-new-charge-value.component.html',
  styleUrls: ['./add-new-charge-value.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddNewChargeValueComponent implements OnInit, OnDestroy {

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  destroyed$ = new Subject();

  chargeId: string;

  trySubmit = new Subject();

  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal) {
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(fromReducer.FORM_ID));
    this.trySubmit.next();
  }

  reset(): void {
    this.store.dispatch(new SetValueAction(fromReducer.FORM_ID, fromReducer.INIT_DEFAULT_STATE));
    this.store.dispatch(new ResetAction(fromReducer.FORM_ID));
  }

  onDismiss(): void {
    this.activeModal.dismiss();
    this.reset();
  }

  onIncreasePercentageChange() {
    this.store.dispatch(new fromStore.CreateNewChargeValueIncreaseChanged());
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  ngOnInit() {
    this.formState$ = this.store.pipe(select(fromStore.selectAddNewChargeValueFromState));
    this.store.pipe(
      select(fromStore.selectAddNewChargeValueIsComplete),
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
      if (form.isInvalid) {
        return null;
      }

      this.activeModal.dismiss();

      const modalRef = this.modalService.open(PopupCommentComponent, {
        backdrop: 'static',
        windowClass: 'comment-modal'
      });

      modalRef.componentInstance.date = new Date();
      modalRef.result.then(({comment, date, actionType}) => {
        this.store.dispatch(new fromStore.CreateNewChargeValue({
          comment: comment,
          date: date,
          actionType: actionType,
          entity: {...form.value, additionalChargeId: this.chargeId},
          chargeId: this.chargeId
        }));
        this.reset();
      }, () => {
        this.modalService.open(
          AddNewChargeValueComponent,
          {backdrop: 'static', windowClass: 'add-charge-value'}
        );
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

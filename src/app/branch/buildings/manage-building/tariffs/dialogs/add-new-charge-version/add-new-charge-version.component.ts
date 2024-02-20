import {Component, OnDestroy} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {takeUntil, tap, withLatestFrom} from 'rxjs/operators';

import * as fromStore from '../../store';
import * as fromReducer from '../../store/reducers/add-new-charge.store';

import {SupplyTypeDropdownItems} from '@models';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

@Component({
  selector: 'add-new-charge-version',
  templateUrl: './add-new-charge-version.component.html',
  styleUrls: ['./add-new-charge-version.component.less']
})
export class AddNewChargeVersionComponent implements OnDestroy {

  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  trySubmit = new Subject();
  destroyed$ = new Subject();

  SupplyTypeDropdownItems = SupplyTypeDropdownItems;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly activeModal: NgbActiveModal,
    private readonly modalService: NgbModal,
  ) {
    this.formState$ = this.store.pipe(select(fromStore.selectAddNewChargeFromState));
    this.store.pipe(
      select(fromStore.selectAddNewChargeIsComplete),
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
        this.store.dispatch(new fromStore.CreateNewCharge({
          comment: comment,
          date: date,
          actionType: actionType,
          entity: form.value
        }));
        this.reset();
      }, () => {
        this.modalService.open(
          AddNewChargeVersionComponent,
          {backdrop: 'static', windowClass: 'add-new-charge'}
        );
      });
    });
  }

  reset(): void {
    this.store.dispatch(new SetValueAction(fromReducer.FORM_ID, fromReducer.INIT_DEFAULT_STATE));
    this.store.dispatch(new ResetAction(fromReducer.FORM_ID));
  }

  onDismiss(): void {
    this.activeModal.dismiss();
    this.reset();
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(fromReducer.FORM_ID));
    this.trySubmit.next();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroupState} from 'ngrx-forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';

import {NgbDateFRParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

import {OrderVersion} from '../../../shared/models';

import * as fromStore from '../../store';
import * as fromReducer from '../../store/reducers/edit-charge-value.reducer';
import {AddNewChargeValueComponent} from '../../dialogs/add-new-charge-value/add-new-charge-value.component';

@Component({
  selector: 'edit-charge-value',
  templateUrl: './edit-charge-value.component.html',
  styleUrls: ['./edit-charge-value.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class EditChargeValueComponent implements OnInit {

  formState$: Observable<FormGroupState<fromReducer.FormValue>>;
  valuesVersions$: Observable<any>;
  valuesVersionOrder$: Observable<OrderVersion>;

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.formState$ = this.store.pipe(select(fromStore.selectEditChargeValueFormState));
    this.valuesVersions$ = this.store.pipe(select(fromStore.selectEditChargeValueVersions));
    this.valuesVersionOrder$ = this.store.pipe(select(fromStore.selectEditChargeValueVersionsOrder));
  }

  onSave(isValid: boolean, chargeId: string, valueId: string, model: any): void {
    if (!isValid) {
      return null;
    }

    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new fromStore.UpdateChargeValue({
        chargeId,
        valueId,
        comment: comment,
        date: date,
        actionType: actionType,
        entity: model
      }));
    }, () => {
    });
  }

  onCancel(chargeId: string): void {
    this.router.navigate(['../../../', chargeId], {relativeTo: this.route});
  }

  onChangeValueVersionOrder(order: OrderVersion): void {
    this.store.dispatch(new fromStore.SetChargeValueVersionsOrder(order));
  }

  onAddValueVersion(chargeId): void {
    const modal = this.modalService.open(AddNewChargeValueComponent, {
      backdrop: 'static',
      windowClass: 'add-charge-value'
    });
    modal.componentInstance.chargeId = chargeId;
  }

  onEditValueVersion(value: any): void {
    this.router.navigate(['../', value.id], {relativeTo: this.route});
  }

  trackByFn(index: number) {
    return index;
  }
}

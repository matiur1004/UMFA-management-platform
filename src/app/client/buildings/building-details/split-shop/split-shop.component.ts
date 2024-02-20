import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BuildingShopViewModel} from '../../shared/models/buildings.model';

import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {withLatestFrom} from 'rxjs/operators';

import * as shopActions from '../../shared/store/actions/shop.actions';

import * as splitShopSelector from '../../shared/store/selectors/split-shop.selector';

import {InitState} from '../../shared/store/reducers/split-shop-form.store';

import {numberMask} from '@shared-helpers';

@Component({
  selector: 'client-split-shop',
  templateUrl: './split-shop.component.html',
  styleUrls: ['./split-shop.component.less']
})
export class SplitShopComponent implements OnInit, OnDestroy {

  form$: Observable<FormGroupState<any>>;
  shop$: Observable<BuildingShopViewModel>;

  numberMask = numberMask({allowDecimal: false});

  constructor(public activeModal: NgbActiveModal, private store: Store<any>) {
    this.form$ = store.pipe(select(splitShopSelector.getSplitShopForm));
    this.shop$ = store.pipe(select(splitShopSelector.getShop));
  }

  ngOnInit() {
  }

  onCancel() {
    this.activeModal.dismiss();
    this.resetForm();
  }

  resetForm() {
    this.store.dispatch(new SetValueAction(InitState.id, InitState.value));
    this.store.dispatch(new ResetAction(InitState.id));
  }

  ngOnDestroy() {
  }

  onChangeShopNumber(event$) {
    this.store.dispatch(new shopActions.ChangeShopsNumber(event$));
  }

  onRemoveShop(event$) {
    this.store.dispatch(new shopActions.RemoveShop(event$));
  }

  onSave() {
    of(null).pipe(withLatestFrom(this.form$, this.shop$, (_, f, s) => ({form: f, shopId: s.id}))).subscribe(({
                                                                                                               form,
                                                                                                               shopId
                                                                                                             }) => {
      if (form.isInvalid) {
        this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
      } else {
        this.store.dispatch(new shopActions.SplitShop({shopId: shopId, shops: form.value.shops}));
        this.onCancel();
      }
    });
  }

  trackById(index, item) {
    return index;
  }
}

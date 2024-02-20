import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {Observable, Subscription} from 'rxjs';

import * as fromServices from '../shared/store/reducers';
import * as serviceFormActions from '../shared/store/actions/service-form.actions';
import {InitState} from '../shared/store/reducers/service-form.store';

@Component({
  selector: 'create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<any>>;
  isComplete$: Subscription;
  isNew: boolean;
  electricityExcludedMeterTypes$: Observable<any[]>;
  waterExcludedMeterTypes$: Observable<any[]>;
  gasExcludedMeterTypes$: Observable<any[]>;
  sewerageExcludedMeterTypes$: Observable<any[]>;
  adHocExcludedMeterTypes$: Observable<any[]>;


  constructor(public activeModal: NgbActiveModal, private store: Store<any>) {
    this.formState$ = store.select(fromServices.getForm);
    this.electricityExcludedMeterTypes$ = store.select(fromServices.getElectricityExcludedMeterTypes);
    this.waterExcludedMeterTypes$ = store.select(fromServices.getWaterExcludedMeterTypes);
    this.gasExcludedMeterTypes$ = store.select(fromServices.getGasExcludedMeterTypes);
    this.sewerageExcludedMeterTypes$ = store.select(fromServices.getSewerageExcludedMeterTypes);
    this.adHocExcludedMeterTypes$ = store.select(fromServices.getAdHocExcludedMeterTypes);
  }

  ngOnInit() {
    this.isComplete$ = this.store.select(fromServices.getIsComplete).subscribe(isComplete => {
      if (isComplete)
        this.activeModal.close();
    });
    this.store.select(fromServices.getIsNew).subscribe(isNew => {
      this.isNew = isNew;
    });
  }

  ngOnDestroy(): void {
    this.isComplete$.unsubscribe()
  }

  dismiss() {
    this.reset();
    this.activeModal.dismiss();
  }

  reset() {
    this.store.dispatch(new SetValueAction(InitState.id, InitState.value));
    this.store.dispatch(new ResetAction(InitState.id));
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
    this.store.dispatch(new serviceFormActions.SendServiceRequest());
  }

  onAddMeterType(meterType, key) {
    this.store.dispatch(new serviceFormActions.AddMeterType({meterType: meterType, key: key}));
  }

  onRemoveMeterType(index, key) {
    this.store.dispatch(new serviceFormActions.RemoveMeterType({index: index, key: key}));
  }
}

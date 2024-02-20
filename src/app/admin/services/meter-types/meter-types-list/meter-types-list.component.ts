import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {FormGroupState, MarkAsSubmittedAction} from 'ngrx-forms';
import * as fromMeterTypeForm from '../shared/store/reducers';
import {FORM_ID} from '../shared/store/reducers/meter-types-form.store';
import * as formMeterTypeAction from '../shared/store/actions/meter-types-form.actions';

import {SupplyTypeDropdownItems} from '@models';

@Component({
  selector: 'meter-types-list',
  templateUrl: './meter-types-list.component.html',
  styleUrls: ['./meter-types-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MeterTypesListComponent implements OnInit {

  @Output() onChangeTab = new EventEmitter<string>();

  formState$: Observable<FormGroupState<any>>;

  supplyTypes: any[] = [];


  constructor(private store: Store<fromMeterTypeForm.State>) {
    this.formState$ = this.store.select(fromMeterTypeForm.getForm);
    this.supplyTypes = SupplyTypeDropdownItems;
  }

  ngOnInit() {
    this.store.dispatch(new formMeterTypeAction.GetMeterTypes());
  }

  onUpdate(event) {
    this.store.dispatch(new MarkAsSubmittedAction(FORM_ID));
    this.store.dispatch(new formMeterTypeAction.UpdateMeterTypes(event));
  }

  addMeterType() {
    this.store.dispatch(new formMeterTypeAction.AddMeterType());
  }

  removeMeterType(event) {
    this.store.dispatch(new formMeterTypeAction.RemoveMeterType(event));
  }

  onCancel() {
    this.onChangeTab.emit('tab-0');
  }

  trackById(index, item) {
    return index;
  }
}

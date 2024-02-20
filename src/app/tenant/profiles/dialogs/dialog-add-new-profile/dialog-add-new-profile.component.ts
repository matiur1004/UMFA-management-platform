import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {numberMask} from '@shared-helpers';
import {FormGroupState, ResetAction, SetValueAction} from 'ngrx-forms';

import {TenantBuildingPopupViewModel} from '../../models/profile.model';

import * as addNewProfileFormActions from '../../../store/actions/add-new-profile.actions';
import * as addNewProfileSelector from '../../../store/selectors/add-new-profile-form.selector';
import {InitState} from '../../../store/reducers/add-new-profile-form.store';

@Component({
  selector: 'dialog-add-new-profile',
  templateUrl: './dialog-add-new-profile.component.html',
  styleUrls: ['./dialog-add-new-profile.component.less']
})
export class DialogAddNewProfileComponent implements OnInit {

  form$: Observable<FormGroupState<any>>;
  tenantBuilding$: Observable<TenantBuildingPopupViewModel>;

  numberMask = numberMask({allowDecimal: false, allowLeadingZeroes: true});

  constructor(public activeModal: NgbActiveModal, private store: Store<any>) {
    this.form$ = store.pipe(select(addNewProfileSelector.getAddNewProfileForm));
    this.tenantBuilding$ = store.pipe(select(addNewProfileSelector.getTenantBuiding));
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

  searchTenant($event) {
    if ($event.length === 10) {
      this.store.dispatch(new addNewProfileFormActions.SearchTenantRequest($event));
    }
  }

  onAddProfile($event) {
    this.store.dispatch(new addNewProfileFormActions.AddNewProfileRequest($event));
  }
}

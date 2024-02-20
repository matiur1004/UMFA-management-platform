import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';

import * as settingsActions from '../store/actions/settings.actions';

import * as generalInfoForm from '../store/reducers/general-info-form.reducer';
import * as changePasswordForm from '../store/reducers/change-password-form.reducer';

import * as generalInfoFormSelector from '../store/selectors/general-info-form.selector';
import * as changePasswordFormSelector from '../store/selectors/change-password-form.selector';


@Component({
  selector: 'page-tenant-settings',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.less']
})
export class PageSettingsComponent implements OnInit, OnDestroy {

  generalInfoForm$: Observable<any>;
  changePasswordForm$: Observable<any>;
  tabId: string = 'tab-0';
  constructor(private store: Store<any>, private router: Router) {
    this.generalInfoForm$ = store.pipe(select(generalInfoFormSelector.getGeneralInfoForm));
    this.changePasswordForm$ = store.pipe(select(changePasswordFormSelector.getChangePasswordForm));
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.EditUser());
  }

  ngOnDestroy() {
  }

  onChangeLogo($event) {
    this.store.dispatch(new settingsActions.SetLogo($event));
  }

  onSaveGeneralInfo() {
    this.store.dispatch(new MarkAsSubmittedAction(generalInfoForm.FORM_ID));
    this.store.dispatch(new settingsActions.SaveUser());
  }

  onSavePassword() {
    this.store.dispatch(new MarkAsSubmittedAction(changePasswordForm.FORM_ID));
    this.store.dispatch(new settingsActions.ChangePassword());
  }

  resetForm(initState: any) {
    this.store.dispatch(new SetValueAction(initState.id, initState.value));
    this.store.dispatch(new ResetAction(initState.id));
    this.router.navigate(['/tenant']);
  }

  onCancelGeneralInfo() {
    this.resetForm(generalInfoForm.InitState);
  }

  onCancelChangePassword() {
    this.resetForm(changePasswordForm.InitState);
  }
}

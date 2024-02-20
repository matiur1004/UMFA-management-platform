import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as settingsActions from './shared/store/actions/settings.actions';
import * as generalInfoFormSelector from './shared/store/selectors/general-info-form.selector';
import {FormGroupState} from 'ngrx-forms';


@Component({
  selector: 'client-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit, OnDestroy {

  generalInfoForm$: Observable<FormGroupState<any>>;

  constructor(private store: Store<any>) {
    this.generalInfoForm$ = store.pipe(select(generalInfoFormSelector.getGeneralInfoForm));
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.GetUserRequest());
  }

  ngOnDestroy() {
  }

}

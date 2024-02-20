import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';

import * as settingsActions from '../actions/settings.actions';
import * as fromSettings from '../../../store/reducers';
import * as fromGeneralInfoForm from '../reducers/general-info-form.reducer';
import * as generalInfoSelector from '../selectors/general-info-form.selector';
import * as changePasswordSelector from '../selectors/change-password-form.selector';

import {AuthService, DataService, UserAccountService} from '@services';
import {UserAccountViewModel} from 'app/shared/models/user-account.model';
import {UserAccountChangePasswordViewModel} from 'app/shared/models/user-account-change-password.model';

@Injectable()
export class SettingsEffects {

  // Get general information
  getGeneralInformation = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.EDIT_USER),
    switchMap(() => {
      return this.userAccountService.get().pipe(
        map(result => {
          const fullName = result.fullName;
          const form = {
            id: result.id,
            firstName: fullName.substr(0, fullName.indexOf(' ')),
            lastName: fullName.substr(fullName.indexOf(' ') + 1),
            email: result.email,
            logoUrl: result.logoUrl,
          };

          return new SetValueAction(fromGeneralInfoForm.FORM_ID, form);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Save user
  saveUser = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.SAVE_USER),
    withLatestFrom(
      this.store$.pipe(select(generalInfoSelector.getGeneralInfoForm)),
      this.store$.pipe(select(generalInfoSelector.getLogo)),
      (_, generalInfoForm, logo) => ({form: generalInfoForm, logo: logo})
    ),
    switchMap(({form, logo}) => {
      if (form.isInvalid) {
        return of({type: 'DUMMY'});
      }

      const formValue = form.value;

      const model = <UserAccountViewModel>{
        id: formValue.id,
        fullName: formValue.firstName + ' ' + formValue.lastName,
        email: formValue.email,
        logo: logo
      };

      return this.userAccountService.update(model).pipe(
        map(result => new settingsActions.SaveUserComplete()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // User update
  userUpdate = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.SAVE_USER_COMPLETE),
    withLatestFrom(
      this.store$.pipe(select(generalInfoSelector.getGeneralInfoForm)),
      (_, generalInfoForm) => ({form: generalInfoForm})
    ),
    map(({form}) => {
      const fullName = form.value.firstName + ' ' + form.value.lastName;
      this.authService.setFullName(fullName);
      this.dataService.userUpdated();
    })
  ), {dispatch: false});
  // Change password
  changePassword = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.CHANGE_PASSWORD),
    withLatestFrom(
      this.store$.pipe(select(changePasswordSelector.getChangePasswordForm)),
      (_, changePasswordForm) => ({form: changePasswordForm})
    ),
    switchMap(({form}) => {
      if (form.isInvalid) {
        return of({type: 'DUMMY'});
      }

      const formValue = form.value;

      const model = <UserAccountChangePasswordViewModel>{
        oldPassword: formValue.oldPassword,
        newPassword: formValue.password,
        newPasswordConfirm: formValue.confirmPassword
      };

      return this.userAccountService.changePassword(model).pipe(
        map(result => new settingsActions.ChangePasswordComplete()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromSettings.State>,
    private userAccountService: UserAccountService,
    private authService: AuthService,
    private dataService: DataService
  ) {
  }

}

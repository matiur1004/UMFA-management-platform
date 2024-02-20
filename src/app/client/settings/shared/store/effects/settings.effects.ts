import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';

import * as settingsActions from '../actions/settings.actions';
import * as fromSettings from '../reducers';
import * as fromGeneralInfoForm from '../reducers/general-info-form.store';

import * as commonDataSelector from 'app/client/layout/shared/store/selectors/common-data.selector';

import {ClientAccountService} from '../../services/client-account.service';
import {ClientSettingViewModel} from '../../models/settings.model';
import {ContactInformationViewModel, webAddresText} from '@models';
import {getAddress} from 'app/client/shared/utilities/address.utility';

@Injectable()
export class SettingsEffects {

  // Get general information
  getGeneralInformation = createEffect(() => this.actions$.pipe(
    ofType(settingsActions.GET_USER_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonDataSelector.getClientId)),
      (_, clientId) => ({clientId: clientId})),
    switchMap(({clientId}) => {
      return this.clientAccountService.getDetails(clientId).pipe(
        map(result => {
          const model = <ClientSettingViewModel>{
            ...result,
            address: getAddress(result.addresses),
            webAddress: this.getWebAddress(result.contactInformations)
          };

          return new SetValueAction(fromGeneralInfoForm.FORM_ID, model);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromSettings.State>,
              private clientAccountService: ClientAccountService) {
  }

  getWebAddress(contactInformations: ContactInformationViewModel[]) {
    if (contactInformations.length) {
      const webAddress = contactInformations.find(ci => ci.label === webAddresText);
      return webAddress ? webAddress.value : '';
    } else {
      return '';
    }
  }
}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as addNewProfileActions from '../actions/add-new-profile.actions';
import * as profilesActions from '../../profiles/store/actions/profile.actions';
import * as fromProfiles from '../reducers';
import {TenantProfilesService} from '../../shared/services/tenant-profiles.service';

@Injectable()
export class AddNewProfileEffects {

  // Get tenant building
  getTenantBuilding = createEffect(() => this.actions$.pipe(
    ofType(addNewProfileActions.SEARCH_TENANT_REQUEST),
    withLatestFrom((action: any) => {
      return {
        activationNumber: action.payload
      };
    }),
    switchMap(({activationNumber}) => {
      return this.tenantProfilesService.getTenantBuilding(activationNumber).pipe(
        map(result => {
          return new addNewProfileActions.SearchTenantRequestComplete(result);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Add new profile
  addNewProfile = createEffect(() => this.actions$.pipe(
    ofType(addNewProfileActions.ADD_NEW_PROFILE_REQUEST),
    withLatestFrom((action: any) => {
      return {
        tenantId: action.payload
      };
    }),
    switchMap(({tenantId}) => {
      return this.tenantProfilesService.addNewProfile(tenantId).pipe(
        map(result => {
          return new profilesActions.TenantBuildingListRequest();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromProfiles.State>,
              private tenantProfilesService: TenantProfilesService) {
  }
}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as profilesActions from '../../profiles/store/actions/profile.actions';
import * as fromProfiles from '../reducers';

import {TenantProfilesService} from '../../shared/services/tenant-profiles.service';

@Injectable()
export class ProfilesEffects {

  // Get list of buildings
  getTenantBuildings = createEffect(() => this.actions$.pipe(
    ofType(profilesActions.TENANT_BUILDING_LIST_REQUEST),
    switchMap(() => {

      return this.tenantProfilesService.getTenantBuildings().pipe(
        map(result => new profilesActions.TenantBuildingListRequestComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Delete profile
  deleteProfile = createEffect(() => this.actions$.pipe(
    ofType(profilesActions.DELETE_PROFILE),
    withLatestFrom((action: any) => ({tenantId: action.payload})),
    switchMap(({tenantId}) => {
      return this.tenantProfilesService.deleteProfile(tenantId).pipe(
        map(result => new profilesActions.TenantBuildingListRequest()),
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

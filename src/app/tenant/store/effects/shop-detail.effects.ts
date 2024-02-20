import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as generalInfoActions from '../actions/shop-detail-actions/general-info.actions';
import * as allocatedEquipmentActions from '../actions/shop-detail-actions/allocated-equipment.actions';
import * as costsActions from '../actions/shop-detail-actions/costs.actions';

import * as generalInfoSelector from '../selectors/shop-detail-selectors/general-info.selector';

import * as fromProfiles from '../reducers';

import {TenantProfilesService} from '../../shared/services/tenant-profiles.service';

@Injectable()
export class ShopDetailEffects {

  // Get shop general info
  getShopDetail = createEffect(() => this.actions$.pipe(
    ofType(generalInfoActions.GET_GENERAL_INFO_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(generalInfoSelector.getShopId)),
      this.store$.pipe(select(generalInfoSelector.getBuildingId)),
      (_, shopId, buildingId) => ({shopId: shopId, buildingId: buildingId})
    ),
    switchMap(({shopId, buildingId}) => {
      return this.tenantProfilesService.getShopGeneralInfo(buildingId, shopId).pipe(
        map(result => new generalInfoActions.GetGeneralInfoRequestComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get shop allocated equipment
  getShopAllocatedEquipment = createEffect(() => this.actions$.pipe(
    ofType(allocatedEquipmentActions.GET_ALLOCATED_EQUIP_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(generalInfoSelector.getShopId)),
      this.store$.pipe(select(generalInfoSelector.getBuildingId)),
      (_, shopId, buildingId) => ({shopId: shopId, buildingId: buildingId})
    ),
    switchMap(({shopId, buildingId}) => {
      return this.tenantProfilesService.getShopAllocatedEquipment(buildingId, shopId).pipe(
        map(items => {
          items.forEach(m => {
            m.photoUrl = this.tenantProfilesService.getMeterPhotoUrl(buildingId, m.meterId);
          });
          return new allocatedEquipmentActions.GetAllocatedEquipRequestComplete(items);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get shop costs
  getShopCosts = createEffect(() => this.actions$.pipe(
    ofType(costsActions.GET_COSTS_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(generalInfoSelector.getShopId)),
      this.store$.pipe(select(generalInfoSelector.getBuildingId)),
      (_, shopId, buildingId) => ({shopId: shopId, buildingId: buildingId})
    ),
    switchMap(({shopId, buildingId}) => {
      return this.tenantProfilesService.getShopCosts(buildingId, shopId).pipe(
        map(result => new costsActions.GetCostsRequestComplete(result)),
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

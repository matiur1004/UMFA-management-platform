import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, debounceTime, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {MeterService} from '../../meter.service';

import * as shopStepActions from '../actions/shop-step.actions';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import * as fromEquipment from '../reducers';
import {UnitType} from '@models';


@Injectable()
export class ShopStepEffects {

  // Get list of shops
  getShops = createEffect(() => this.actions$.pipe(
    ofType(shopStepActions.GET_SHOPS_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId, versionId})),
    switchMap(({buildingId, versionId}) => {

      return this.equipmentService.getShops(buildingId, versionId).pipe(
        map(items => new shopStepActions.GetShopsRequestComplete(items.map(item => {
              return {
                ...item,
                unitType: UnitType.Shop
              };
            })
          )
        ),
        catchError(r => of({type: 'DUMMY'}))
      );
    })
  ));
  // Get list of common areas
  getCommonAreas = createEffect(() => this.actions$.pipe(
    ofType(shopStepActions.GET_COMMON_AREAS_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId, versionId})),
    switchMap(({buildingId, versionId}) => {

      return this.equipmentService.getCommonAreas(buildingId, versionId).pipe(
        map(items => new shopStepActions.GetCommonAreasRequestSuccess(items.map(item => {
            return {
              ...item,
              unitType: UnitType.CommonArea
            };
          }))
        ),
        catchError(r => of({type: 'DUMMY'}))
      );
    })
  ));
  // Update search term
  updateSearchKey = createEffect(() => this.actions$.pipe(
    ofType(shopStepActions.UPDATE_SEARCH_TERM),
    withLatestFrom((action: any) => ({searchKey: action.payload})),
    debounceTime(300),
    map(({searchKey}) => {
      return new shopStepActions.UpdateSearchTermComplete(searchKey);
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromEquipment.State>, private equipmentService: MeterService) {
  }
}

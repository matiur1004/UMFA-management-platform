import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {StringExtension} from 'app/shared/helper/string-extension';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromFloorsReducers from '../selectors/floor-plan.selectors';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import {OccupationService} from '@services';
import {VersionViewModel} from '@models';

@Injectable()
export class FloorPlansEffects {
  
  getBuildingFloors$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BUILDING_FLOORS, fromActions.GET_BUILDING_SHOPS_SUCCESS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      this.store$.select(fromFloorsReducers.selectFloorPlansShops),
      (_, buildingId, versionId, shops) => {
        return {
          buildingId: buildingId,
          versionId: versionId,
          shops: shops
        };
      }),
    switchMap(({buildingId, versionId, shops}) =>
      this.s.getBuildingFloors(buildingId, versionId)
        .pipe(
          map((res: any) => new fromActions.GetBuildingFloorsSuccess(this.getFloors(res, shops))),
          catchError((res: HttpErrorResponse) => of({type: 'DUMMY'}))
        )
    )
  ));

  
  getBuildingShops$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BUILDING_SHOPS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          versionId: versionId
        }
      }),
    switchMap(({buildingId, versionId}) =>
      this.s.getBuildingShops(buildingId, versionId)
        .pipe(
          map((res: any) => new fromActions.GetBuildingShopsSuccess(res)),
          catchError((res: HttpErrorResponse) => of({type: 'DUMMY'}))
        )
    )
  ));

  
  setActiveFloorPlan$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_FLOOR_PLAN, fromActions.GET_BUILDING_FLOORS_SUCCESS),
    withLatestFrom(
      this.store$.select(fromFloorsReducers.selectFloorPlansActiveFloorSequenceNumber),
      this.store$.select(fromFloorsReducers.selectFloorPlansFloors),
      (_, activeFloor, floors) => {
        return {
          activeFloor,
          floors
        };
      }),
    switchMap(({activeFloor, floors}) => {

      let floorId = null;
      if (floors && floors.length) {
        floorId = floors[activeFloor].id;
      }

      return [new fromActions.SetActivePlanFloor(floorId)];
    })
  ));

  
  saveBuildingFloors$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SAVE_FLOOR_PLAN),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      this.store$.select(fromFloorsReducers.selectFloorPlansActiveFloor),
      this.store$.select(fromFloorsReducers.selectFloorPlansFloors),
      (action: fromActions.SaveFloorPlan, buildingId, versionId, activeFloorId, floors) => ({
        buildingId: buildingId,
        versionId: versionId,
        model: action.payload,
        activeFloorId: activeFloorId,
        floors: floors
      })
    ),
    switchMap(({buildingId, versionId, model, activeFloorId, floors}) => {
      const {comment, date, actionType, floorPlan} = model;
      let entity = floors.map(f => {
        let model = {
          id: f.id,
          floorNumber: f.floorNumber,
          schema: f.schema
        };

        if (model.id === activeFloorId)
          model.schema = floorPlan;
        return model;
      });

      const version: VersionViewModel<any[]> = new VersionViewModel(entity, comment, actionType, date, versionId);

      return this.s.saveFloorPlan(buildingId, version)
        .pipe(mergeMap((res: any) => {
            return [
              new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
              new commonDataActions.HistoryChange(res.current.id),
              new commonDataActions.GetHistoryWithVersionId(res.current.id),
              new fromActions.SaveFloorPlanSuccess(floorPlan)
            ]
          }),
          catchError((res: HttpErrorResponse) => of({type: 'DUMMY'}))
        );
    })
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: OccupationService
  ) {
  }

  getFloors(srcFloors: any[], shops: any[]) {
    let shopsDictionary = {};
    let floors = [];

    shops.forEach(item => {
      const floorKey = item.floor || 0;
      if (!shopsDictionary[floorKey])
        shopsDictionary[floorKey] = [];

      shopsDictionary[floorKey].push(item);
    });

    for (var key in shopsDictionary) {
      var floor = srcFloors.find(f => f.floorNumber === parseFloat(key));
      var floorName = 'Floor ' + key;

      if (floor)
        floor.name = floorName;
      else
        floor = {
          id: StringExtension.NewGuid(),
          name: floorName,
          floorNumber: parseFloat(key),
          schema: ''
        };

      floor.shops = shopsDictionary[key];

      floors.push(floor);
    }

    return floors;
  }
}

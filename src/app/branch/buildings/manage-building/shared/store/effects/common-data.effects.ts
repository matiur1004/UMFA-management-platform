import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {BuildingPeriodViewModel} from 'app/branch/buildings/manage-building/shared/models/building-period.model';
import {versionDayKey} from 'app/shared/helper/version-date-key';
import {of} from 'rxjs';
import {catchError, flatMap, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {BuildingPeriodsService} from '../../services/building-periods.service';
import {BuildingVersionHistoryService} from '../../services/building-version-history.service';
import * as fromCommonDataAction from '../actions/common-data.action';
import * as selectors from '../selectors/common-data.selectors';

import * as state from '../state/common-data.state';
import * as readingHistoryAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/readings-history-actions/readings-history.action';
import { LocalStorageService } from '@app/shared/services/local-storage.service';

@Injectable()
export class CommonDataEffects {

  getHistories = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.BUILDING_ID_GUARD_UPDATE_BUILDING_ID),
    withLatestFrom(this.store$.pipe(select(selectors.getBuildingId)),
      (action: any, buildingId: string) =>
        ({buildingId: buildingId, payload: action.payload})),
    switchMap(({buildingId, payload}) => {
      this.store$.dispatch(new readingHistoryAction.DefaultReadings());

      return this.loadHistory(payload.buildingId);
    }),
    catchError(() => of(new fromCommonDataAction.LoadBuildingHistoryFailed()))
  ));
  getActiveBuildingPeriod = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.GET_ACTIVE_BUILDING_PERIOD),
    flatMap((action: any) => this.loadActiveBuildingPeriod(action.payload.buildingId)),
    catchError(() => of(new fromCommonDataAction.LoadBuildingHistoryFailed()))
  ));
  refreshHistories = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.GET_HISTORY_REQUEST_WITH_VERSION_ID),
    withLatestFrom(this.store$.pipe(select(selectors.getBuildingId)),
      (action: any, buildingId: string) =>
        ({buildingId: buildingId, versionId: action.payload})),
    switchMap(({buildingId, versionId}) => {
      return this.loadHistory(buildingId, versionId);

    }),
    catchError(() => of(new fromCommonDataAction.LoadBuildingHistoryFailed()))
  ));
  updateUrlVersion = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.UPDATE_URL_VERSION_ACTION),
    withLatestFrom(
      (a: any) => ({versionDate: a.payload})),
    switchMap(({versionDate}) => {
      let url = this.router.url;
      if (versionDate) {
        url = url.replace(/version\/([0-9]{8}|null)\//, 'version/' + versionDayKey(versionDate) + '/');
      }
      return of(new fromCommonDataAction.SetNavigationUrl(url));
    })
  ));
  updateUrlVersionAndNewItem = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.CREATE_ITEM_UPDATE_URL_VERSION_ACTION),
    withLatestFrom(
      (a: any) => ({versionDate: a.payload.versionDate, itemId: a.payload.itemId})),
    switchMap(({versionDate, itemId}) => {
      let url = this.router.url;
      if (versionDate) {
        url = url.replace(/version\/[0-9]{8}\//, 'version/' + versionDayKey(versionDate) + '/');
      }
      url = url.replace(/\/new/, '/' + itemId);
      return of(new fromCommonDataAction.SetNavigationUrl(url));
    })
  ));
  navigateToNewVersion = createEffect(() => this.actions$.pipe(
    ofType(fromCommonDataAction.LOAD_BUILDING_HISTORY_COMPLETE),
    withLatestFrom(
      this.store$.pipe(select(selectors.getRedirectUrl)),
      (action: any, url) => {
        return ({url});
      }
    ),
    switchMap(({url}) => {
      if (!url) {
        return [];
      }
      this.router.navigateByUrl(url, {replaceUrl: true});
      return of(new fromCommonDataAction.SetNavigationUrl(''));
    }),
    catchError(() => of(new fromCommonDataAction.LoadBuildingHistoryFailed()))
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<state.State>,
    private router: Router,
    private localStorage: LocalStorageService,
    private buildingPeriodService: BuildingPeriodsService,
    private buildingHistoryService: BuildingVersionHistoryService
  ) {
  }

  private loadActiveBuildingPeriod(buildingId: string) {
    return this.buildingPeriodService.getActiveBuildingPeriod(buildingId)
      .pipe(map((activeBuildingPeriod: BuildingPeriodViewModel) =>
        new fromCommonDataAction.LoadActiveBuildingPeriodComplete({activeBuildingPeriod})));
  }

  private loadHistory(buildingId, versionId = null) {
    return this.buildingHistoryService.getVersionHistory(buildingId).pipe(map((data) => {
      // Added versionDay property for using in urls
      data.logs = data.logs.map(el => {
        return {
          ...el,
          versionDay: versionDayKey(el.startDate)
        };
      });
      return new fromCommonDataAction.LoadBuildingHistoryComplete({
        logs: data.logs,
        isComplete: data.isComplete,
        buildingId,
        versionId
      });
    }), catchError(e => of(new fromCommonDataAction.LoadBuildingHistoryFailed())));
  }
}

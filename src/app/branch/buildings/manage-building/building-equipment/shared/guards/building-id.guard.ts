import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, first, map, mapTo} from 'rxjs/operators';

import {State as CommonDataState} from '../../../shared/store/state/common-data.state';
import * as fromStore from '../../../shared/store/selectors/common-data.selectors';
import * as actions from '../../../shared/store/actions/common-data.action';
import {Actions, ofType} from '@ngrx/effects';

@Injectable()
export class BuildingIdGuard implements CanActivate {
  constructor(
    private readonly store$: Store<CommonDataState>,
    private readonly actions$: Actions
  ) {
  }


  getDataFromApiOrStore(buildingId): Observable<any> {
    return this.store$.pipe(
      select(fromStore.getBuildingId),
      map((storeBldId) => {
        if (storeBldId !== buildingId) {
          this.store$.dispatch(new actions.BuildingIdGuardChangeBuildingId({buildingId}));
          this.store$.dispatch(new actions.GetActiveBuildingPeriod({buildingId}));
        }
        return storeBldId === buildingId;
      }),
      filter(u => u));
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(actions.LOAD_BUILDING_HISTORY_FAILED)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const buildingId = next.params['id'];
    if (!buildingId) {
      return of(false);
    }

    return race(
      this.getDataFromApiOrStore(buildingId).pipe(mapTo(true)),
      this.getErrorAction().pipe(mapTo(false)))
      .pipe(
        catchError(() => of(false)),
        first());
  }
}

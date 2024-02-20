import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, zip} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

import * as fromActions from '../store/actions';
import * as fromStore from '../store/reducers';
import * as fromSelectors from '../store/selectors';
import * as fromCommonStore from '../../shared/store/selectors/common-data.selectors';

@Injectable()
export class BuildingAllocatedTariffsGuard implements CanActivate, CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(
    private readonly store: Store<fromStore.State>,
  ) {
  }

  getDataFromApiOrStore(buildingId: string): Observable<any> {
    return zip(
      this.store.pipe(select(fromSelectors.selectBuildingData)),
      this.store.pipe(select(fromSelectors.selectBuildingHistories)),
      this.store.pipe(select(fromCommonStore.getSelectedVersionId))
    ).pipe(
      tap(([buildingData, history, versionId]) => {
        if (!buildingData) {
          this.store.dispatch(new fromActions.GetBuildingData(buildingId));
        } else if (!history) {
          this.store.dispatch(new fromActions.GetBuildingHistory({buildingId}));
        }

        if (buildingData && history && versionId) {
          this.store.dispatch(new fromActions.GetBuildingHistory({buildingId, versionId: versionId}));
        }
      }),
      filter(
        (data: any) => data !== false && data !== null && data !== 'undefined'
      ),
      take(1)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const buildingId = next.parent.parent.parent.params.id;
    return this.getDataFromApiOrStore(buildingId).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromActions.PurgeAllocatedBuildingTariffsStore());
    this.store.dispatch(new fromActions.PurgeBuildingAdditionalChargesStore());
    return true;
  }
}

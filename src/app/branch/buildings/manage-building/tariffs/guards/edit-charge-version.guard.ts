import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, zip} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromSelectors from '../store/selectors';

@Injectable()
export class EditChargeVersionGuard implements CanActivate, CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(
    private readonly store: Store<fromStore.State>,
  ) {
  }

  getDataFromApiOrStore(buildingId: string, chargeId: string): Observable<any> {
    return zip(
      this.store.pipe(select(fromSelectors.selectBuildingData)),
      this.store.pipe(select(fromSelectors.selectBuildingHistories)),
    ).pipe(
      tap(([buildingData, history]) => {
        this.store.dispatch(new fromStore.SetChargeVersionId(chargeId));

        if (!buildingData) {
          this.store.dispatch(new fromStore.GetBuildingData(buildingId));
        }

        if (!history) {
          this.store.dispatch(new fromStore.GetBuildingHistory({buildingId}));
        }

        if (buildingData && history) {
          this.store.dispatch(new fromStore.GetChargeData({buildingId, chargeId}));
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
    const buildingId = next.parent.parent.parent.parent.params.id;
    const {chargeId} = next.params;
    return this.getDataFromApiOrStore(buildingId, chargeId).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromStore.PurgeEditChargeVersionStore());
    return true;
  }
}

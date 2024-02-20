import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, zip} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromSelectors from '../store/selectors';

@Injectable()
export class EditChargeValueGuard implements CanActivate, CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(
    private readonly store: Store<fromStore.State>,
  ) {
  }

  getDataFromApiOrStore(buildingId: string, chargeId: string, valueId: string): Observable<any> {
    return zip(
      this.store.pipe(select(fromSelectors.selectBuildingData)),
      this.store.pipe(select(fromSelectors.selectBuildingHistories)),
    ).pipe(
      tap(([buildingData, history]) => {
        this.store.dispatch(new fromStore.SetChargeValueIds({chargeId, valueId}));

        if (!buildingData) {
          this.store.dispatch(new fromStore.GetBuildingData(buildingId));
        }

        if (!history) {
          this.store.dispatch(new fromStore.GetBuildingHistory({buildingId}));
        }

        if (buildingData && history) {
          this.store.dispatch(new fromStore.GetChargeValueData({buildingId, chargeId, valueId}));
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
    const {valueId, chargeId} = next.params;
    return this.getDataFromApiOrStore(buildingId, chargeId, valueId).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromStore.PurgeEditChargeValueStore());
    return true;
  }
}

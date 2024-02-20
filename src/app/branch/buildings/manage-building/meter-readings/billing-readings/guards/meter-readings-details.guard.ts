import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';

import * as fromReadings from '../shared/store/reducers';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {ReadingsHistoryService} from '../shared/services/readings-history.service';
import * as fromMeterReadings
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers';
import * as billingReadingsAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
import {BuildingPeriodsService} from '@app/branch/buildings/manage-building/shared/services/building-periods.service';

@Injectable()
export class MeterReadingsDetailsGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromReadings.State>,
    private historyService: ReadingsHistoryService,
    private buildingPeriodsService: BuildingPeriodsService) {
  }

  getDataFromApiOrStore(next: ActivatedRouteSnapshot) {
    return this.store.pipe(
      select(fromMeterReadings.getMeterReadingDetails),
      map(meterReadingDetails => meterReadingDetails && meterReadingDetails.length),
      switchMap(res => {
        if (res) {
          return of(true);
        }

        const buildingId = next.parent.parent.params.id;

        // Retrieve building period
        return this.getBuildingPeriod(buildingId).pipe(
          tap((buildingPeriodId: string) => {
            this.store.dispatch(new billingReadingsAction.RequestBuildingBillingReadingsList({periodId: buildingPeriodId}));
          }),
          switchMap(() => {
            return this.getDataFromApiOrStore(next);
          })
        );
      })
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.store.dispatch(new billingReadingsAction.RequestBuildingPeriodsList());

    return this.getDataFromApiOrStore(next).pipe(
      catchError(e => of(false))
    );
  }

  private getBuildingPeriod(buildingId: string): Observable<string> {
    return this.buildingPeriodsService.getAllShort(buildingId)
      .pipe(map(historiesReading => historiesReading[0].id));
  }

}

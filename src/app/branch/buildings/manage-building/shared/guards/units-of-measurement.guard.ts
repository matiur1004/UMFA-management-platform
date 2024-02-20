import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import {State as CommonDataState} from '../store/state/common-data.state';
import * as fromStore from '../store/selectors/common-data.selectors';
import * as actions from '../store/actions/common-data.action';
import {EquipmentService} from '@services';

@Injectable()
export class UnitsOfMeasurementGuard implements CanActivate {
  constructor(private readonly store: Store<CommonDataState>,
              private equipmentService: EquipmentService) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store.pipe(
      select(fromStore.getUnitsOfMeasurement),
      map(data => !!data),
      switchMap(loaded => {
        if (loaded) {
          return of(loaded);
        }

        return this.getDataFromApi();
      }),
      take(1)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.getDataFromApiOrStore().pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    );
  }

  private getDataFromApi() {
    return this.equipmentService.getUnitsOfMeasurement()
      .pipe(
        tap(unitsOfMeasurement => this.store.dispatch(new actions.SetUnitsOfMeasurement(unitsOfMeasurement))),
        map(() => true)
      );
  }
}

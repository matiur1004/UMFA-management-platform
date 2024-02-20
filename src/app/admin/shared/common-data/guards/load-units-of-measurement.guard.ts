import {EquipmentService} from '@services';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import * as commonData from '../store/reducers';
import {getUnitsOfMeasurement} from '../store/selectors';
import * as actions from '../store/actions/common.actions';

@Injectable()
export class LoadUnitsOfMeasurementGuard implements CanActivate {
  constructor(private readonly store: Store<commonData.State>, private service: EquipmentService) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store.pipe(
      select(getUnitsOfMeasurement),
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
    return this.service.getUnitsOfMeasurement()
      .pipe(
        tap(unitOfMeasurement => this.store.dispatch(new actions.SetUnitsOfMeasurement(unitOfMeasurement))),
        map(() => true)
      );
  }
}

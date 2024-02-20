import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as selectors from '../store/selectors';
import * as bldTariffsActions from '../store/actions/building-tariffs.actions';
import {BuildingTariffsService} from '../services/building-tariffs.service';

@Injectable()
export class LoadRegistersGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>, private service: BuildingTariffsService) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store.pipe(
      select(selectors.getRegisters),
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
      catchError(() => of(false))
    );
  }

  private getDataFromApi() {
    return this.service.getEquipmentRegisters()
      .pipe(
        tap(registers => this.store.dispatch(new bldTariffsActions.ApiEquipmentGetRegistersSuccess(registers))),
        map(() => true)
      );
  }
}

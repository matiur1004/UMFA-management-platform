import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import * as equipmentActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/equipment.actions';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';

@Injectable()
export class EquipmentGuard implements CanActivate {
  constructor(private readonly store: Store<fromEquipment.State>) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store.pipe(
      select(fromEquipment.getEquipmentList),
      map(data => !!data && data.length > 0),
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

  private getDataFromApi(): Observable<boolean> {
    this.store.dispatch(new equipmentActions.RequestEquipmentList());

    return of(true);
  }
}

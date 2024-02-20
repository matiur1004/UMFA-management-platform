import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, mapTo, take, tap} from 'rxjs/operators';

import * as fromStore from '../store/reducers';
import * as actions from '../store/actions/node.actions';
import {Actions, ofType} from '@ngrx/effects';

@Injectable()
export class SuppliesGuard implements CanActivate {
  constructor(
    private readonly store$: Store<fromStore.State>,
    private actions$: Actions
  ) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store$.pipe(
      select(fromStore.getAllSupplies),
      tap((supplies: any) => {
        if (!supplies) {
          this.store$.dispatch(new actions.GetSuppliesRequest());
        }
      }),
      filter((supplies: any) => !!supplies));
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(actions.GET_SUPPLIES_REQUEST_FAILED)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return race(
      this.getDataFromApiOrStore().pipe(mapTo(true)),
      this.getErrorAction().pipe(mapTo(false)))
      .pipe(
        catchError(() => of(false)),
        take(1));
  }
}

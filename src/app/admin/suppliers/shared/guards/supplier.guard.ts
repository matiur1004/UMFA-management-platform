import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, mapTo, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as selectors from '../store/selectors';
import * as supplierActions from '../store/actions/supplier-common.actions';
import {SupplierViewModel} from '@models';
import {Actions, ofType} from '@ngrx/effects';

@Injectable()
export class SupplierGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>, private actions$: Actions) {
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(supplierActions.API_SUPPLIER_LOAD_FAILED)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const supplierId = next.params['supplierId'];
    if (!supplierId) {
      return of(false);
    }
    return race(
      this.getDataFromApiOrStore(supplierId).pipe(mapTo(true)),
      this.getErrorAction().pipe(mapTo(false)))
      .pipe(
        catchError(() => of(false)),
        take(1));
  }

  private getDataFromApiOrStore(supplierId: string) {
    return this.store.pipe(
      select(selectors.getCurrentSupplier),
      tap((data: SupplierViewModel) => {
        if (!data || data.id !== supplierId) {
          this.store.dispatch(new supplierActions.ApiSupplierLoad({supplierId}));
        }
      }),
      filter(
        (data: SupplierViewModel) => !!data && data.id === supplierId
      ),
      take(1)
    );
  }
}

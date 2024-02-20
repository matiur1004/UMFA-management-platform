import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as selectors from '../store/selectors';
import * as actions from '../store/actions/supplier-common.actions';
import {SupplierService} from '../services/supplier.service';

@Injectable()
export class TariffSettingsGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>, private service: SupplierService) {
  }

  getDataFromApiOrStore(supplierId: string): Observable<any> {
    return this.store.pipe(select(selectors.getTariffSettings),
      switchMap((s) => {
        if (!!s && s.supplierId === supplierId) {
          return of(true);
        }

        return this.getDataFromApi(supplierId);
      }),
      take(1)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const supplierIdDepth = +next.data['supplierIdDepth'];
    let sRoute = next;
    if (supplierIdDepth) {
      let i = 0;
      while (i++ < supplierIdDepth && sRoute.parent) {
        sRoute = sRoute.parent;
      }
    }
    const supplierId = sRoute.params['supplierId'];
    if (!supplierId) {
      return of(false);
    }
    return this.getDataFromApiOrStore(supplierId).pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    );
  }

  private getDataFromApi(supplierId: string) {
    return this.service.getSupplierTariffCategories(supplierId)
      .pipe(
        tap(tariffSettings => {
          this.store.dispatch(new actions.ApiTariffSettingsRequestSucceeded({
            ...tariffSettings,
            supplierId
          }));
        }),
        map(() => true)
      );
  }
}

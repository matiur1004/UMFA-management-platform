import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of, race} from 'rxjs';
import {catchError, filter, mapTo, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as fromSelectors from '../store/selectors';
import * as fromTariffValueActions from '../store/actions/tariff-values.actions';
import * as fromTariffValueFormActions from 'app/shared/tariffs/store/actions/tariff-value-form.actions';
import {TariffValuesViewModel, VersionViewModel} from '@models';
import {Actions, ofType} from '@ngrx/effects';

@Injectable()
export class TariffValuesGuard implements CanActivate, CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(private readonly store: Store<fromTariff.State>, private actions$: Actions) {
  }

  getErrorAction() {
    return this.actions$.pipe(
      ofType(fromTariffValueActions.GET_TARIFF_VALUES_FAILED)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const tariffId = next.params['versionId'];
    const valueVersionId = next.params['valueVersionId'];
    const supplierIdDepth = +next.data['supplierIdDepth'];
    let sRoute = next;

    if (supplierIdDepth) {
      let i = 0;
      while (i++ < supplierIdDepth && sRoute.parent) {
        sRoute = sRoute.parent;
      }
    }
    const supplierId = sRoute.params['supplierId'];
    if (!supplierId || !tariffId || !valueVersionId) {
      return of(false);
    }

    return race(
      this.getDataFromApiOrStore(valueVersionId, tariffId, supplierId).pipe(mapTo(true)),
      this.getErrorAction().pipe(mapTo(false)))
      .pipe(
        catchError(() => of(false)),
        take(1));
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromTariffValueActions.PurgeTariffValues());
    this.store.dispatch(new fromTariffValueFormActions.PurgeTariffValuesForm({formId: fromTariff.SupplierTariffValuesFormId}));
    return true;
  }

  private getDataFromApiOrStore(valueVersionId, versionId, supplierId) {
    return this.store.pipe(
      select(fromSelectors.selectTariffValues),
      tap((data: VersionViewModel<TariffValuesViewModel>) => {
        if (!data || data.id !== valueVersionId) {
          this.store.dispatch(new fromTariffValueActions.GetTariffValues({
            valueVersionId: valueVersionId,
            versionId,
            supplierId
          }));
        }
      }),
      filter(
        (data: VersionViewModel<TariffValuesViewModel>) => !!data && data.id === valueVersionId
      ),
      take(1)
    );
  }
}

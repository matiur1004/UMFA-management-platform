import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as fromTariffValueActions from '../store/actions/tariff-values.actions';
import * as fromTariffValueFormActions from 'app/shared/tariffs/store/actions/tariff-value-form.actions';
import {BuildingTariffsService} from '../services/building-tariffs.service';
import {sortRule} from '@shared-helpers';

@Injectable()
export class TariffValuesGuard implements CanActivate, CanDeactivate<Observable<boolean> | Promise<boolean> | boolean> {
  constructor(private readonly store: Store<fromTariff.State>,
              private service: BuildingTariffsService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const buildingIdDepth = +next.data['buildingIdDepth'];
    let bldRoute = next;
    if (buildingIdDepth) {
      let i = 0;
      while (i++ < buildingIdDepth && bldRoute.parent) {
        bldRoute = bldRoute.parent;
      }
    }
    const tariffId = next.params['tariffVersionId'];
    const valueVersionId = next.params['valueVersionId'];
    const buildingId = bldRoute.params['id'];
    if (!buildingId) {
      return of(false);
    }
    return this.getDataFromApi(valueVersionId, tariffId, buildingId).pipe(
      catchError(() => of(false))
    );
  }

  canDeactivate(component: Observable<boolean> | Promise<boolean> | boolean) {
    this.store.dispatch(new fromTariffValueActions.PurgeTariffValues());
    this.store.dispatch(new fromTariffValueFormActions.PurgeTariffValuesForm({formId: fromTariff.buildingTariffValuesFormId}));
    return true;
  }

  private getDataFromApi(valueVersionId, versionId, buildingId) {
    return this.service.getTariffValue({valueVersionId, versionId, buildingId})
      .pipe(
        map(res => {
          res.entity.lineItemValues.forEach(l => {
            if (l.stepSchema) {
              l.stepSchema.ranges.sort((a, b) => sortRule(a.from, b.from));

              l.values.sort(
                (a, b) =>
                  l.stepSchema.ranges
                    .findIndex(i => i.id === a.stepRangeId) -
                  l.stepSchema.ranges
                    .findIndex(i => i.id === b.stepRangeId)
              );
            }
          });

          return res;
        }),
        tap(data => this.store.dispatch(new fromTariffValueActions.GetTariffValuesSuccess(data))),
        map(() => true)
      );
  }
}

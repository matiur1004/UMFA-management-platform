import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as selectors from '../store/selectors';
import {BuildingTariffsService} from '../services/building-tariffs.service';
import * as actions from '../store/actions/building-tariffs.actions';

@Injectable()
export class TariffSettingsGuard implements CanActivate {

  constructor(
    private readonly store: Store<fromTariff.State>,
    private service: BuildingTariffsService
  ) {
  }

  getDataFromApiOrStore(buildingId: string): Observable<any> {
    return this.store.pipe(select(selectors.getTariffSettings),
      switchMap((s) => {
        if (!!s && s.buildingId === buildingId) {
          return of(true);
        }

        return this.getDataFromApi(buildingId);
      }),
      take(1)
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const buildingId = next.parent.parent.params['id'];

    if (!buildingId) {
      return of(false);
    } else {
      return this.getDataFromApi(buildingId).pipe(
        catchError(() => of(false))
      );
    }
  }

  private getDataFromApi(buildingId: string) {
    return this.service.getBuildingTariffCategories(buildingId)
      .pipe(
        tap(tariffSettings => {
          this.store.dispatch(new actions.ApiTariffSettingsRequestSucceeded({
            ...tariffSettings,
            buildingId
          }));
        }),
        map(() => true)
      );
  }
}

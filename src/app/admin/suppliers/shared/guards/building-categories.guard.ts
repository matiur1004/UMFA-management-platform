import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as selectors from '../store/selectors';
import * as actions from '../store/actions/tariff.actions';
import {TariffService} from '../services/tariff.service';

@Injectable()
export class BuildingCategoriesGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>, private service: TariffService) {
  }

  getDataFromApiOrStore(): Observable<any> {
    return this.store.pipe(
      select(selectors.getBuildingCategories),
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
    return this.service.getAllCategory()
      .pipe(
        tap(items => this.store.dispatch(new actions.GetBuildingCategoriesComplete(items))),
        map(() => true)
      );
  }
}

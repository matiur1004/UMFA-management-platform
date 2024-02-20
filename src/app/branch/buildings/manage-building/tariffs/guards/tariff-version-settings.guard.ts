import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import * as fromTariffVersionSettings
  from 'app/branch/buildings/manage-building/tariffs/store/selectors/tariff-version-settings.selectors';
import * as reducers from 'app/branch/buildings/manage-building/tariffs/store/reducers/index';
import {SetValueAction} from 'ngrx-forms';
import {TariffVersionSettingsViewModel} from "@app/shared/models/tariff-version-settings.model";

@Injectable()
export class TariffVersionSettingsGuard implements CanActivate {
  constructor(
    private readonly store: Store<fromTariff.State>,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.getDataFromStore().pipe(
      catchError((e) => {
        console.log(e);
        return of(false);
      })
    );
  }

  private getDataFromStore() {
    return this.store.pipe(
      select(fromTariffVersionSettings.getVersionSettings),
      tap(tariffVersionSettings => {
        this.store.dispatch(new SetValueAction(reducers.buildingTariffCategoriesFormId, this.getCategoriesFormValue(tariffVersionSettings)))
        this.store.dispatch(new SetValueAction(reducers.buildingTariffStepsFormId, this.getStepsFormValue(tariffVersionSettings)))
      }),
      map(() => true)
    );
  }

  private getCategoriesFormValue(tariffVersionSettings: TariffVersionSettingsViewModel) {
    if (!tariffVersionSettings) {
      return {
        categoriesEnabled: false,
        categories: []
      };
    }

    const {categoriesEnabled, tariffCategories} = tariffVersionSettings;
    return {
      categoriesEnabled: categoriesEnabled,
      categories: tariffCategories
    };
  }

  private getStepsFormValue(tariffVersionSettings: TariffVersionSettingsViewModel) {
    if (!tariffVersionSettings) {
      return {
        stepsEnabled: false,
        steps: []
      };
    }

    const {stepsEnabled, tariffSteps} = tariffVersionSettings;
    return {
      stepsEnabled: stepsEnabled,
      steps: tariffSteps
    }
  }
}

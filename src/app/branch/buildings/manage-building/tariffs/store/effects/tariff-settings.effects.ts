import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {ResetAction, unbox} from 'ngrx-forms';
import {catchError, filter, switchMap, withLatestFrom} from 'rxjs/operators';


import * as fromSelectors from '../selectors';
import * as fromStore from '../reducers';
import * as fromActions from '../actions/tariff-settings.actions';
import {BuildingTariffsService} from '../../services/building-tariffs.service';


@Injectable()
export class BuildingTariffSettingsEffects {

  updateTariffCategories: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(fromActions.API_BUILDING_TARIFF_SETTINGS_UPDATE),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.getTariffCategoriesFormState)),
      this.store$.pipe(select(fromSelectors.getTariffStepsFormState)),
      (action: fromActions.ApiUpdateTariffSettings, categoriesForm, stepsForm) => {
        return {buildingId: categoriesForm.value.id, categoriesForm, stepsForm};
      }),
    filter(({categoriesForm, stepsForm}) => categoriesForm.isValid && stepsForm.isValid),
    switchMap(({buildingId, categoriesForm, stepsForm}) => {
      const categories = unbox(categoriesForm.value.categories).map(c => {
        c.buildingId = buildingId;
        return c;
      });
      const steps = unbox(stepsForm.value.steps).map(s => {
        s.buildingId = buildingId;
        return s;
      });

      const model = {
        categoriesEnabled: categoriesForm.value.categoriesEnabled,
        tariffCategories: categories,
        stepsEnabled: stepsForm.value.stepsEnabled,
        tariffSteps: steps
      };

      return this.tariffsService.updateBuildingTariffCategories(buildingId, model).pipe(
        switchMap(() => {
          return [
            new fromActions.ApiUpdateTariffSettingsSucceeded(),
            new ResetAction(fromStore.buildingTariffCategoriesFormId),
            new ResetAction(fromStore.buildingTariffStepsFormId)
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private tariffsService: BuildingTariffsService
  ) {
  }
}

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroupState, MarkAsSubmittedAction, SetValueAction} from 'ngrx-forms';
import {TariffStepsFormValue} from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import {CategoriesFormValue} from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import {select, Store} from '@ngrx/store';

import * as fromStore from '../store';
import * as selectors from '../store/selectors';
import * as fromActions from '../store/actions';
import {first, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'building-tariff-settings',
  templateUrl: './building-tariff-settings.component.html',
  styleUrls: ['./building-tariff-settings.component.less']
})
export class BuildingTariffSettingsComponent implements OnInit {
  categoriesFormState$: Observable<FormGroupState<CategoriesFormValue>>;
  stepsFormState$: Observable<FormGroupState<TariffStepsFormValue>>;

  constructor(
    private store: Store<fromStore.State>
  ) {
    store.pipe(select(selectors.getTariffSettings),
      withLatestFrom(store.pipe(select(selectors.getBuildingId))), first()).subscribe(
      ([tariffSettings, buildingId]) => {
        this.store.dispatch(new SetValueAction(fromStore.buildingTariffStepsFormId, {
          stepsEnabled: tariffSettings.stepsEnabled,
          steps: tariffSettings.tariffSteps,
          id: buildingId
        }));
        this.store.dispatch(new SetValueAction(fromStore.buildingTariffCategoriesFormId, {
          categoriesEnabled: tariffSettings.categoriesEnabled,
          categories: tariffSettings.tariffCategories,
          id: buildingId
        }));
      }
    );
  }

  ngOnInit() {
    this.stepsFormState$ = this.store.pipe(select(fromStore.getTariffStepsFormState));
    this.categoriesFormState$ = this.store.pipe(select(fromStore.getTariffCategoriesFormState));
  }

  onSave() {
    // mark forms as submitted
    this.store.dispatch(new MarkAsSubmittedAction(fromStore.buildingTariffCategoriesFormId));
    this.store.dispatch(new MarkAsSubmittedAction(fromStore.buildingTariffStepsFormId));

    this.store.dispatch(new fromActions.ApiUpdateTariffSettings());
  }

}

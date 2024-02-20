import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {CategoriesFormValue} from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import {TariffStepsFormValue} from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import {FormGroupState, MarkAsSubmittedAction, SetValueAction} from 'ngrx-forms';
import {Observable} from 'rxjs';
import {first, withLatestFrom} from 'rxjs/operators';
import * as supplierCategoriesActions from '../../shared/store/actions/supplier-categories.actions';
import * as supplierCommonActions from '../../shared/store/actions/supplier-common.actions';

import * as fromSupplier from '../../shared/store/reducers';
import {SupplierCategoriesFormId} from '../../shared/store/reducers';
import * as fromSelectors from '../../shared/store/selectors';

@Component({
  selector: 'supplier-categories',
  templateUrl: './supplier-categories.component.html',
  styleUrls: ['./supplier-categories.component.less']
})
export class SupplierCategoriesComponent implements OnInit, OnDestroy {

  categoriesFormState$: Observable<FormGroupState<CategoriesFormValue>>;
  stepsFormState$: Observable<FormGroupState<TariffStepsFormValue>>;

  hasTypesOfTariffs: boolean = false;
  kVaCalculationsEnabled: boolean = false;
  reCalculationsEnabled: boolean = false;

  constructor(
    private store: Store<fromSupplier.State>
  ) {
  }

  ngOnInit() {
    this.initData();
    this.categoriesFormState$ = this.store.pipe(select(fromSelectors.getTariffCategoriesFormState));
    this.stepsFormState$ = this.store.pipe(select(fromSelectors.getTariffStepsFormState));
  }

  ngOnDestroy() {
    this.store.dispatch(new supplierCommonActions.ClearTariffSettingsStore());
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(SupplierCategoriesFormId));
    this.store.dispatch(new supplierCategoriesActions.ApiUpdateSupplierCategories());
  }

  onCancel() {
    this.initData();
  }

  private initData() {
    this.store.pipe(select(fromSelectors.getTariffSettings),
      withLatestFrom(this.store.pipe(select(fromSelectors.getSupplierId), first()))).subscribe(
      ([tariffSettings, buildingId]) => {

        this.store.dispatch(new SetValueAction(fromSupplier.SupplierStepsFormId, {
          stepsEnabled: tariffSettings.stepsEnabled,
          steps: tariffSettings.tariffSteps,
          id: buildingId
        }));

        this.store.dispatch(new SetValueAction(fromSupplier.SupplierCategoriesFormId, {
          categoriesEnabled: tariffSettings.categoriesEnabled,
          categories: tariffSettings.tariffCategories,
          id: buildingId
        }));

      }
    );
  }
}

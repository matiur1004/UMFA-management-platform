import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormGroupState} from 'ngrx-forms';
import * as tariffVersionSettingsActions from 'app/shared/tariffs/store/actions/tariff-version-settings.actions';
import {CategoriesFormValue} from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import {TariffStepsFormValue} from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromSelectors from 'app/branch/buildings/manage-building/tariffs/store/selectors';
import * as fromSupplier from 'app/branch/buildings/manage-building/tariffs/store/reducers';
import {take} from 'rxjs/operators';
import {SupplierCategoriesFormId, SupplierStepsFormId} from '@app/admin/suppliers/shared/store/reducers';

@Component({
  selector: 'tariff-version-settings',
  templateUrl: './tariff-version-settings.component.html',
  styleUrls: ['./tariff-version-settings.component.less']
})
export class TariffVersionSettingsComponent implements OnInit {
  categoriesFormState$: Observable<FormGroupState<CategoriesFormValue>>;
  stepsFormState$: Observable<FormGroupState<TariffStepsFormValue>>;

  tariffVersionId: string;
  buildingId: string;

  constructor(
    private store: Store<fromSupplier.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.categoriesFormState$ = this.store.pipe(select(fromSelectors.getTariffCategoriesFormState));
    this.stepsFormState$ = this.store.pipe(select(fromSelectors.getTariffStepsFormState));
  }

  ngOnInit(): void {
    this.activatedRoute.pathFromRoot[6].params.subscribe(params => {
      this.tariffVersionId = params['tariffVersionId'];
    });

    this.activatedRoute.pathFromRoot[4].params.subscribe(params => {
      this.buildingId = params['id'];
    });
  }

  cancel(): void {
    this.router.navigate(['../../'], {relativeTo: this.activatedRoute})
  }

  save(): void {
    let latestCategoriesIds: string[];

    this.categoriesFormState$
      .pipe(take(1))
      .subscribe(res => {
        latestCategoriesIds = res.value.categories.map(c => c.id);
      });

    this.store.dispatch(new tariffVersionSettingsActions.GetTariffCategoriesAllocatedUnits({
      tariffVersionId: this.tariffVersionId,
      tariffCategoryIds: latestCategoriesIds,
      categoryFormId: SupplierCategoriesFormId,
      stepFormId: SupplierStepsFormId,
      saveAction: new tariffVersionSettingsActions.SaveTariffVersionSettings({
        tariffVersionId: this.tariffVersionId,
        buildingId: this.buildingId
      })
    }));
  }
}

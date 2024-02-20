import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormGroupState} from 'ngrx-forms';
import {CategoriesFormValue} from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import {TariffStepsFormValue} from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromSelectors from '@app/admin/suppliers/shared/store/selectors';
import * as tariffVersionSettingsActions from '@app/shared/tariffs/store/actions/tariff-version-settings.actions';
import * as fromSupplier from '../../../shared/store/reducers';
import {take} from 'rxjs/operators';
import {TariffCoordinationService} from '@app/shared/tariffs/services/tariff-coordination.service';

@Component({
  selector: 'tariff-version-settings',
  templateUrl: './tariff-version-settings.component.html',
  styleUrls: ['./tariff-version-settings.component.less']
})
export class TariffVersionSettingsComponent implements OnInit {
  categoriesFormState$: Observable<FormGroupState<CategoriesFormValue>>;
  stepsFormState$: Observable<FormGroupState<TariffStepsFormValue>>;

  tariffVersionId: string;
  tariffCategoryIds: string[];

  constructor(
    private store: Store<fromSupplier.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tariffCoordinationService: TariffCoordinationService
  ) {

    this.categoriesFormState$ = this.store.pipe(select(fromSelectors.getTariffCategoriesFormState));
    this.stepsFormState$ = this.store.pipe(select(fromSelectors.getTariffStepsFormState));
  }

  ngOnInit(): void {
    this.activatedRoute.pathFromRoot[4].params.subscribe(params => {
      this.tariffVersionId = params['versionId'];
    });

    this.tariffCoordinationService.updateTariffVersionId(this.tariffVersionId);
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
      categoryFormId: fromSupplier.SupplierCategoriesFormId,
      stepFormId: fromSupplier.SupplierStepsFormId,
      saveAction: new tariffVersionSettingsActions.SaveTariffVersionSettings({tariffVersionId: this.tariffVersionId})
    }));
  }
}

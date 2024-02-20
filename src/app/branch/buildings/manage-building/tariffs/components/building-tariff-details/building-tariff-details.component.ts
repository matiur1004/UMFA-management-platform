import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable, of, Subject, Subscription} from 'rxjs';
import {takeUntil, withLatestFrom} from 'rxjs/operators';
import {FormGroupState} from 'ngrx-forms';
import {select, Store} from '@ngrx/store';

import {
  CategoryViewModel,
  getSupplyTypeIndexes,
  TariffValueInfoViewModel,
  TariffVersionCategoryViewModel,
  TariffVersionStepModel
} from '@models';
import * as tariffVersionActions from 'app/shared/tariffs/store/actions/tariff-versions.actions';
import * as tariffActions from '../../store/actions/tariff.actions';
import * as tariffValueActions from '../../store/actions/tariff-values.actions';

import * as buildingTariff from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as costProviderNodesActions from '../../store/actions/cost-provider-nodes.actions';
import * as tariffVersionSettingsSelectors from '../../store/selectors/tariff-version-settings.selectors';

@Component({
  selector: 'building-tariff-details',
  templateUrl: './building-tariff-details.component.html',
  styleUrls: ['./building-tariff-details.component.less']
})
export class BuildingTariffDetailsComponent implements OnInit, OnDestroy {
  buildingId$: Observable<string>;
  formState$: Observable<FormGroupState<any>>;
  tariffVersionCategories$: Observable<TariffVersionCategoryViewModel[]>;
  tariffVersionSteps$: Observable<TariffVersionStepModel[]>;
  attributes$: Observable<any[]>;
  unitsOfMeasurement$: Observable<any[]>;
  chargingTypes$: Observable<any[]>;
  lineItems$: Observable<any[]>;
  buildingCategories$: Observable<CategoryViewModel[]>;
  tariffVersions$: Observable<any[]>;
  tariffSubVersions$: Observable<any[]>;
  tariffValuesVersions$: Observable<TariffValueInfoViewModel[]>;
  versionOrderIndex$: Observable<number>;
  subVersionOrderIndex$: Observable<number>;
  valuesVersionOrderIndex$: Observable<number>;
  costProviderNodes$: Observable<any>;
  supplyTypes = getSupplyTypeIndexes();
  maxMajorVersion$: Observable<number>;
  isLastTariffVersion$: Observable<boolean>;
  destroy$: Subject<void> = new Subject<void>();
  routeSubscription$: Subscription;
  branchId: string;
  buildingId: string;
  tariffVersionId: string;

  constructor(
    private store$: Store<buildingTariff.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.buildingId$ = this.store$.pipe(select(selectors.getBuildingId));
    this.formState$ = this.store$.pipe(select(selectors.getTariffForm));
    this.tariffVersionCategories$ = this.store$.pipe(
      select(tariffVersionSettingsSelectors.getVersionCategories)
    );
    this.tariffVersionSteps$ = this.store$.pipe(select(tariffVersionSettingsSelectors.getVersionSteps));
    this.attributes$ = this.store$.pipe(select(selectors.getAttributes));
    this.unitsOfMeasurement$ = this.store$.pipe(
      select(selectors.getFilteredUnitsOfMeasurement)
    );
    this.chargingTypes$ = this.store$.pipe(select(selectors.getChargingTypes));
    this.lineItems$ = this.store$.pipe(
      select(selectors.getTariffFormLineItems)
    );
    this.buildingCategories$ = this.store$.pipe(
      select(selectors.getBuildingCategories)
    );
    this.tariffVersions$ = this.store$.pipe(
      select(selectors.getTariffVersionsSorted)
    );
    this.tariffSubVersions$ = this.store$.pipe(
      select(selectors.getTariffSubVersionsSorted)
    );
    this.versionOrderIndex$ = this.store$.pipe(
      select(selectors.getTariffVersionsOrder)
    );
    this.subVersionOrderIndex$ = this.store$.pipe(
      select(selectors.getTariffSubVersionsOrder)
    );
    this.valuesVersionOrderIndex$ = this.store$.pipe(
      select(selectors.getTariffValuesOrder)
    );
    this.tariffValuesVersions$ = this.store$.pipe(
      select(selectors.getTariffValuesSorted)
    );
    this.maxMajorVersion$ = this.store$.pipe(
      select(selectors.getTariffFormMaxMajorVersion)
    );
    this.costProviderNodes$ = this.store$.pipe(
      select(selectors.getCostProviderNodes)
    );
    this.isLastTariffVersion$ = this.store$.pipe(
      select(selectors.isLastVersion)
    );
  }

  ngOnInit(): void {
    this.store$.dispatch(
      new costProviderNodesActions.RequestCostProviderNodes()
    );

    this.routeSubscription$ = combineLatest([
      this.activatedRoute.pathFromRoot[2].params,
      this.activatedRoute.pathFromRoot[4].params,
      this.activatedRoute.pathFromRoot[7].params
    ]).subscribe(([branchParams, buildingParams, tariffParams]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.tariffVersionId = tariffParams['tariffVersionId'];
    });
  }

  dispatchFn = a => this.store$.dispatch(a);

  onSave(isNewVersion = false): void {
    this.store$.dispatch(new tariffActions.ResultTariffPopupSuccess({result: isNewVersion, isSubVersion: false}));
  }

  onAddTariffVersion(isSubVersion: boolean): void {
    this.store$.dispatch(new tariffActions.AddTariffVersion(isSubVersion));
  }

  onEditTariffVersion(event) {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'tariffs', 'building-tariffs', event]);
  }

  onEditTariffValuesVersion(versionId: string) {
    this.router.navigate(['values', versionId], {
      relativeTo: this.activatedRoute
    });
  }

  onChangeTariffValueVersionOrder(event: number) {
    this.store$.dispatch(
      new tariffVersionActions.UpdateTariffValuesVersionsOrder(
        buildingTariff.buildingTariffAreaName,
        event
      )
    );
  }

  onChangeTariffSubVersionOrder(event) {
    this.store$.dispatch(
      new tariffVersionActions.UpdateTariffSubVersionsOrder(
        buildingTariff.buildingTariffAreaName,
        event
      )
    );
  }

  onAddVersionValue() {
    of(null)
      .pipe(
        withLatestFrom(
          this.formState$,
          this.lineItems$,
          this.tariffValuesVersions$,
          (_, form, lineItems, tariffValues: TariffValueInfoViewModel[]) => {
            const sortRule = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
            const tariffValue =
              tariffValues &&
              tariffValues
                .map(v => ({
                  startDate: new Date(v.startDate).getTime(),
                  id: v.id
                }))
                .sort((a, b) => sortRule(b.startDate, a.startDate))
                .find(a => !!a);
            return {
              lineItems,
              baseTariffValueId: tariffValue ? tariffValue.id : null,
              tariffVersionId: form.value.versionId,
            };
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({lineItems, baseTariffValueId, tariffVersionId}) => {
        this.store$.dispatch(
          new tariffValueActions.CreateTariffValueFormInit({
            tariffVersionId,
            baseTariffValueId,
            lineItems,
          })
        );
      });
  }

  onAddValueSubVersion(tariffValueId: string): void {
    this.store$.dispatch(new tariffValueActions.CreateTariffValueVersion({
      tariffValueId: tariffValueId,
      tariffVersionId: this.tariffVersionId
    }));
  }

  onDeleteTariffVersion(versionId: string): void {
    this.store$.dispatch(new tariffActions.DeleteTariffSubVersion({tariffVersionId: versionId}))
  }

  onDeleteTariffValuesVersion(tariffValueVersionId: string): void {
    of(null)
      .pipe(
        withLatestFrom(this.formState$, (_, form) => ({
          tariffVersionId: form.value.versionId
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(({tariffVersionId}) =>
        this.store$.dispatch(
          new tariffValueActions.DeleteTariffValuesVersionRequest({
            tariffVersionId: tariffVersionId,
            tariffValueVersionId: tariffValueVersionId
          })
        )
      );
  }

  onDeleteTariffValue(tariffValueId: string): void {
    this.store$.dispatch(new tariffValueActions.DeleteTariffValueRequest({
      tariffVersionId: this.tariffVersionId,
      tariffValueId: tariffValueId
    }));
  }


  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.routeSubscription$?.unsubscribe();
  }
}

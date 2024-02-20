import {
  CategoryViewModel,
  OrderVersion,
  SupplyType,
  TariffValueVersionInfoViewModel,
  TariffVersionCategoryViewModel,
  TariffVersionInfoViewModel,
  TariffVersionStepModel,
  TariffViewModel,
  UnitOfMeasurement,
  VersionViewModel
} from '@models';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil, withLatestFrom} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';
import {FormGroupState} from 'ngrx-forms';

import * as supplierCommonActions from '../../../shared/store/actions/supplier-common.actions';
import * as tariffFormActions from '../../../shared/store/actions/tariff-form.actions';
import * as tariffValueActions from '../../../shared/store/actions/tariff-values.actions';
import * as fromTariff from '../../../shared/store/reducers';
import * as selectors from '../../../shared/store/selectors';
import {StringExtension} from '../../../../../shared/helper/string-extension';
import * as tariffVersionActions from 'app/shared/tariffs/store/actions/tariff-versions.actions';
import * as tariffVersionSettingsSelectors from '../../../shared/store/selectors/tariff-version-settings.selectors';
import * as tariffActions from '../../../shared/store/actions/tariff.actions';

import {TariffCoordinationService} from '@app/shared/tariffs/services/tariff-coordination.service';
import {FormValue} from "@app/shared/tariffs/store/reducers/tariff-form.store";

@Component({
  selector: 'tariff-detail',
  templateUrl: './tariff-detail.component.html',
  styleUrls: ['./tariff-detail.component.less']
})
export class TariffDetailComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<FormValue>>;
  tariffVersions$: Observable<any[]>;
  tariffSubVersions$: Observable<TariffVersionInfoViewModel[]>;
  tariffValuesVersions$: Observable<TariffValueVersionInfoViewModel[]>;
  supplyTypes$: Observable<any[]>;
  tariffVersionCategories$: Observable<TariffVersionCategoryViewModel[]>;
  tariffVersionSteps$: Observable<TariffVersionStepModel[]>;
  attributes$: Observable<any[]>;
  unitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  lineItems$: Observable<any[]>;
  chargingTypes$: Observable<number[]>;
  buildingCategories$: Observable<CategoryViewModel[]>;
  versionOrderIndex$: Observable<number>;
  subVersionOrderIndex$: Observable<number>;
  valuesVersionOrderIndex$: Observable<number>;
  supplierTariffVersions$: Observable<VersionViewModel<TariffViewModel>[]>;

  supplierId: string;
  versionId: string;

  supplyType = SupplyType;
  orderType = OrderVersion;

  supplyTypeText = {
    [SupplyType.Electricity]: 'Electricity',
    [SupplyType.Water]: 'Water',
    [SupplyType.Gas]: 'Gas',
    [SupplyType.Sewerage]: 'Sewerage',
    [SupplyType.AdHoc]: 'Ad Hoc'
  };

  destroyed$ = new Subject();

  maxMajorVersion$: Observable<number>;
  isLastTariffVersion$: Observable<boolean>;

  constructor(private store$: Store<fromTariff.State>,
              private activatedRoute: ActivatedRoute,
              private tariffCoordinationService: TariffCoordinationService,
              private router: Router
  ) {
    this.supplyTypes$ = this.store$.pipe(select(selectors.getSuppliersSupplyTypes));
    this.formState$ = this.store$.pipe(select(selectors.getTariffForm));
    this.tariffVersionCategories$ = this.store$.pipe(select(tariffVersionSettingsSelectors.getVersionCategories));
    this.tariffVersionSteps$ = this.store$.pipe(select(tariffVersionSettingsSelectors.getVersionSteps));
    this.attributes$ = this.store$.pipe(select(selectors.getAttributes));
    this.unitsOfMeasurement$ = this.store$.pipe(select(selectors.getFilteredUnitsOfMeasurement));
    this.chargingTypes$ = this.store$.pipe(select(selectors.getChargingTypes));
    this.lineItems$ = this.store$.pipe(select(selectors.getTariffFormLineItems));
    this.buildingCategories$ = this.store$.pipe(select(selectors.getBuildingCategories));
    this.tariffVersions$ = this.store$.pipe(select(selectors.getTariffVersionsSorted));
    this.tariffSubVersions$ = this.store$.pipe(select(selectors.getTariffSubVersionsSorted));
    this.versionOrderIndex$ = this.store$.pipe(select(selectors.getTariffVersionsOrder));
    this.subVersionOrderIndex$ = this.store$.pipe(select(selectors.getTariffSubVersionsOrder));
    this.valuesVersionOrderIndex$ = this.store$.pipe(select(selectors.getTariffValuesOrder));
    this.tariffValuesVersions$ = this.store$.pipe(select(selectors.getTariffValuesSorted));
    this.maxMajorVersion$ = this.store$.pipe(select(selectors.getTariffFormMaxMajorVersion));
    this.isLastTariffVersion$ = this.store$.pipe(select(selectors.isLastVersion));
  }

  dispatchFn = (a) => this.store$.dispatch(a);

  ngOnInit(): void {
    const pathFromRoot = this.activatedRoute.pathFromRoot;
    pathFromRoot[4].params
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        window.scroll(0, 0);
        this.supplierId = params['supplierId'];
        this.versionId = params['versionId'];

        if (StringExtension.isGuid(this.supplierId)) {
          this.store$.dispatch(new supplierCommonActions.ApiSupplierGetTariffCategories());
        }
        if (StringExtension.isGuid(this.versionId)) {
          this.tariffCoordinationService.updateTariffVersionId(this.versionId);
        }

        this.store$.dispatch(new tariffFormActions.EditTariff());

      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSave(isNewVersion = false) {
    this.store$.dispatch(new tariffActions.ResultTariffPopupSuccess({result: isNewVersion, isSubVersion: false}));
  }

  onChangeTariffValueVersionOrder(event: number) {
    this.store$.dispatch(new tariffVersionActions.UpdateTariffValuesVersionsOrder(fromTariff.SupplierTariffAreaName, event));
  }

  onChangeTariffSubVersionOrder(event): void {
    this.store$.dispatch(new tariffVersionActions.UpdateTariffSubVersionsOrder(fromTariff.SupplierTariffAreaName, event));
  }

  onAddTariffVersion(isSubVersion: boolean): void {
    this.store$.dispatch(new tariffActions.AddTariffVersion(isSubVersion));
  }

  onEditTariffVersion(event) {
    this.router.navigate(['admin', 'suppliers', this.supplierId, 'tariffs', event]);
  }

  onEditTariffValuesVersion(versionId: string): void {
    window.scrollTo(0, 0);
    this.router.navigate(['admin', 'suppliers', this.supplierId, 'tariffs', this.versionId, 'values', versionId]);
  }

  onDeleteTariffVersion(versionId: string): void {
    this.store$.dispatch(new tariffActions.DeleteTariffSubVersion({versionId: versionId}))
  }

  onDeleteTariffValuesVersion(tariffValueVersionId: string): void {
    this.store$.dispatch(new tariffValueActions.DeleteTariffValuesVersionRequest({
      tariffVersionId: this.versionId,
      tariffValueVersionId: tariffValueVersionId
    }));
  }

  onDeleteTariffValue(tariffValueId: string): void {
    this.store$.dispatch(new tariffValueActions.DeleteTariffValueRequest({
      tariffVersionId: this.versionId,
      tariffValueId: tariffValueId
    }));
  }

  onAddVersionValue() {
    of(null).pipe(
      withLatestFrom(
        this.formState$,
        this.lineItems$,
        this.tariffValuesVersions$,
        (_, form, lineItems, tariffValues: any[]) => {
          const sortRule = (a, b) => (a > b) ? 1 : (a < b) ? -1 : 0;
          const tariffValue = tariffValues && tariffValues.map(v => ({
            startDate: new Date(v.startDate).getTime(),
            id: v.id
          }))
            .sort((a, b) => sortRule(b.startDate, a.startDate)).find(a => !!a);
          return {
            lineItems: tariffValue ? lineItems : null,
            baseTariffValueId: tariffValue ? tariffValue.id : null,
            tariffVersionId: form.value.versionId,
          };
        }
      )
    ).subscribe(({lineItems, baseTariffValueId, tariffVersionId}) => {
      this.store$.dispatch(new tariffValueActions.CreateTariffValueFormInit({
        tariffVersionId,
        baseTariffValueId,
        lineItems,
      }));
    });
  }

  onAddValueSubVersion(tariffValueId: string): void {
    this.store$.dispatch(new tariffValueActions.CreateTariffValueVersion({
      tariffValueId: tariffValueId,
      tariffVersionId: this.versionId
    }));
  }
}

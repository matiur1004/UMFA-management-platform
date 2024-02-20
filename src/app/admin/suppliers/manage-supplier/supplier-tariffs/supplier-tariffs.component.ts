import {Component, OnDestroy, OnInit} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import * as fromTariffs from '../../shared/store/reducers';
import * as selectors from '../../shared/store/selectors';
import * as tariffFormActions from '../../shared/store/actions/tariff-form.actions';
import * as tariffValuesActions from '../../shared/store/actions/tariff-values.actions';

import {
  AggregatedTariffViewModel,
  NewTariffVersionViewModel,
  OrderTariffList,
  SupplyType,
  TariffViewModel,
  VersionViewModel
} from '@models';
import {TariffCoordinationService} from '../../../../shared/tariffs/services/tariff-coordination.service';
import * as tariffActions from '@app/admin/suppliers/shared/store/actions/tariff.actions';

@Component({
  selector: 'supplier-tariffs',
  templateUrl: './supplier-tariffs.component.html',
  styleUrls: ['./supplier-tariffs.component.less']
})
export class SupplierTariffsComponent implements OnInit, OnDestroy {

  tariffs$: Observable<AggregatedTariffViewModel[]>;

  buildingCategories$: Observable<any>;
  selectedSupplyTypeText$: Observable<string>;
  selectedBuildingCategoryText$: Observable<string>;
  supplierId$: Subscription;
  supplierId: string;

  orderIndex = 1;
  supplyType = SupplyType;
  supplyTypes: SupplyType[] = [SupplyType.Electricity, SupplyType.Gas, SupplyType.Sewerage, SupplyType.Water, SupplyType.AdHoc];
  supplyTypeText = {
    [SupplyType.Electricity]: 'Electricity',
    [SupplyType.Water]: 'Water',
    [SupplyType.Gas]: 'Gas',
    [SupplyType.Sewerage]: 'Sewerage',
    [SupplyType.AdHoc]: 'Ad Hoc'
  };

  constructor(
    private store: Store<fromTariffs.State>,
    private tariffService: TariffCoordinationService) {
    this.tariffs$ = tariffService.getTariffs();
    this.buildingCategories$ = tariffService.getAllBuildingCategories();
    this.supplierId$ = store.pipe(select(selectors.getSupplierId)).subscribe(id => this.supplierId = id);

    this.selectedSupplyTypeText$ = store.select(selectors.getTariffSupplyTypeFilter).pipe(map(s => {
      if (s < 0) {
        return 'All supply types';
      }

      return this.supplyTypeText[s];
    }));

    this.selectedBuildingCategoryText$ = store.select(selectors.getTariffBuildingCategoryFilter).pipe(map(c => {
      return c ? c.name : 'All consumers';
    }));
  }

  ngOnInit() {
    this.tariffService.requestTariffList();
  }

  ngOnDestroy() {
    this.supplierId$.unsubscribe();
    this.tariffs$ = null;
    this.tariffService.updateSearchKey('');
  }

  search(event): void {
    this.tariffService.updateSearchKey(event);
  }

  onBuildingCategoryChanged(event) {
    this.tariffService.updateBuildingCategoryId(event);
  }

  onSupplyTypeChanged(event) {
    this.tariffService.updateSupplyTypeFilter(event);
  }

  changeOrderIndex(event) {
    if (this.orderIndex === event || (this.orderIndex === (event * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = event;
    }

    if (this.orderIndex === OrderTariffList.VersionAsc || this.orderIndex === OrderTariffList.VersionDesc) {
      this.tariffService.updateVersionOrder(this.orderIndex);
    } else {
      this.tariffService.updateOrder(this.orderIndex);
    }
  }

  onCreate() {
    this.store.dispatch(new tariffFormActions.CreateTariffClick());
  }

  onEditTariff(event) {
    this.tariffService.openTariffDetails(event);
  }

  onEditTariffValue(event) {
    this.tariffService.openTariffValue(event.tariffVersionId, event.tariffValueId);
  }

  onAddNewTariffVersion(versionViewModel: NewTariffVersionViewModel) {
    const maxVersion = Math.max(...versionViewModel.versions.map(x => x.majorVersion));
    const tariffId = versionViewModel.currentTariff.id;
    this.tariffService.openTariffDetails(versionViewModel.vId);
    versionViewModel.currentTariff.versionId = versionViewModel.vId;
    this.store.dispatch(new tariffActions.AddTariffVersion(
      false,
      {
        tariffId: tariffId,
        majorVersion: maxVersion,
        minorVersion: 0,
        currentTariff: versionViewModel.currentTariff
      }));
  }

  onAddNewTariffValue(tariffVersion: VersionViewModel<TariffViewModel>): void {
    this.store.dispatch(new tariffValuesActions.CreateTariffValueAddNewValue({
      tariffVersion: tariffVersion
    }));
  }

  onDeleteTariffVersion(tariff) {
    this.tariffService.deleteTariffVersion(tariff.entity.id, tariff.majorVersion);
  }
}

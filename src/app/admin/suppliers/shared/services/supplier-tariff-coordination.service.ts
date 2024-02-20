import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {take, withLatestFrom} from 'rxjs/operators';
import * as fromStore from '../store/reducers';
import * as selectors from '../store/selectors';
import * as tariffActions from '../store/actions/tariff.actions';
import {TariffCoordinationService} from '../../../../shared/tariffs/services/tariff-coordination.service';
import {AggregatedTariffViewModel} from '@models';

@Injectable()
export class SupplierTariffCoordinationService extends TariffCoordinationService {

  constructor(
    private store: Store<fromStore.State>,
    private router: Router
  ) {
    super();
  }

  public getTariffs(): Observable<AggregatedTariffViewModel[]> {
    return this.store.pipe(select(selectors.getSortedTariffs));
  }

  public getAllBuildingCategories(): Observable<{ id: string, name: string }[]> {
    return this.store.pipe(select(selectors.getBuildingCategories));
  }

  public openTariffDetails(tariffVersionId) {
    this.getSupplierIdObservable()
      .subscribe((supplierId) => this.router.navigate(['admin', 'suppliers', supplierId, 'tariffs', tariffVersionId]));
  }

  public openTariffValue(tariffVersionId, tariffValueId) {
    this.getSupplierIdObservable()
      .subscribe((supplierId) =>
        this.router.navigate(['admin', 'suppliers', supplierId, 'tariffs', tariffVersionId, 'values', tariffValueId]));
  }

  public openNewTariffVersion(tariffVersionId) {
    this.getSupplierIdObservable()
      .subscribe((supplierId) =>
        this.router.navigate(['admin', 'suppliers', supplierId, 'tariffs', tariffVersionId, 'new-version']));
  }

  public deleteTariffSubVersion(tariffVersionId) {
    this.store.dispatch(new tariffActions.DeleteTariffSubVersion({versionId: tariffVersionId}));
  }

  public deleteTariffVersion(tariffId: string, majorVersion: number) {
    this.store.dispatch(new tariffActions.DeleteTariffVersion({tariffId: tariffId, majorVersion: majorVersion}));
  }

  public updateVersionOrder(orderIndex) {
    this.store.dispatch(new tariffActions.UpdateVersionOrder(orderIndex));

  }

  public updateOrder(orderIndex) {
    this.store.dispatch(new tariffActions.UpdateOrder(orderIndex));
  }

  public updateSupplyTypeFilter(supplyType: any) {
    this.store.dispatch(new tariffActions.UpdateSupplyTypeFilter(supplyType));
  }

  public updateSearchKey(searchKey: any) {
    this.store.dispatch(new tariffActions.UpdateSearchKey(searchKey));
  }

  public updateBuildingCategoryId(bldCategoryId: any) {
    this.store.dispatch(new tariffActions.UpdateBuildingCategoryId(bldCategoryId));
  }

  public requestTariffList() {
    this.store.dispatch(new tariffActions.RequestTariffList());
  }

  public updateTariffVersionId(tariffVersionId: any) {
    this.store.dispatch(new tariffActions.UpdateTariffVersionId(tariffVersionId));
  }

  private getSupplierIdObservable() {
    return of(null).pipe(
      withLatestFrom(this.store.pipe(select(selectors.getSupplierId)), (_, supplierId) => supplierId),
      take(1)
    );
  }
}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {SupplierService} from '../../services';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import {BranchTariffViewModel, SupplierListOrder} from '../../models';
import {getStrFromPhysicalAddress, sortRule} from '@shared-helpers';
import {VersionViewModel} from '@models';
import {AggregatedTariffViewModel} from '../../models/supplier-branch-view.model';

@Injectable()
export class AllocatedSuppliersEffects {

  getAllocatedSuppliers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_ALLOCATED_SUPPLIERS),
    switchMap((action: fromActions.GetAllocatedSuppliers) =>
      this.s.getBranchSuppliers(action.payload)
        .pipe(
          map((res: any) => {
            const resModified = res.map(
              (item) => {
                item.physicalAddressStr = getStrFromPhysicalAddress(item.physicalAddress);
                return item;
              }
            );
            return new fromActions.GetAllocatedSuppliersSuccess(resModified);
          }),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetAllocatedSuppliersFailed(res.error)))
        )
    )
  ));


  filterAllocatedSuppliers = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_ALLOCATED_SUPPLIERS_FILTER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectAllocatedSuppliersEntities)),
      (action: fromActions.SetAllocatedSuppliersFilter, entities) => ({
        entities,
        filter: action.payload
      })
    ),
    map(({entities, filter}) => {
        const filteredSuppliers = this.getFilteredSuppliers(
          [...entities],
          filter,
          (supplier, filterItem) => supplier.supplyTypes.indexOf(filterItem) >= 0
        );

        const filteredSuppliersTariffs = filteredSuppliers.map((item: any) => {
          const newItem = {...item};
          newItem.tariffs = this.getFilteredSuppliers(
            item.tariffs,
            filter,
            (supplier, filterItem) => supplier.supplyType === filterItem
          )
          return newItem;
        });
        return new fromActions.UpdateAllocatedSuppliers(filteredSuppliersTariffs);
      }
    )
  ));


  orderAllocatedSuppliers = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_ALLOCATED_SUPPLIERS_ORDER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectAllocatedSuppliersList)),
      (action: fromActions.SetAllocatedSuppliersFilter, entities) => ({
        entities,
        order: action.payload
      })
    ),
    map(({entities, order}) => {
        const orderedSuppliers = this.getSortedSuppliers(entities, order);
        return new fromActions.UpdateAllocatedSuppliers(orderedSuppliers);
      }
    )
  ));


  getAllocatedSupplierTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_ALLOCATED_SUPPLIER_TARIFFS),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBranchId)),
      (action: fromActions.GetAllocatedSupplierTariffs, branchId: string) => ({
        branchId,
        supplierId: action.payload
      })
    ),
    switchMap(({branchId, supplierId}) =>
      this.s.getSupplierTariffs(branchId, supplierId)
        .pipe(
          map((tariffs) => new fromActions.GetAllocatedSupplierTariffsSuccess({tariffs, supplierId})),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetAllocatedSupplierTariffsFailed(res.error)))
        )
    )
  ));


  setAllocatedSupplierTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_ALLOCATED_SUPPLIER_TARIFFS_SUCCESS),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectAllocatedSuppliersList)),
      (action: fromActions.GetAllocatedSupplierTariffsSuccess, entities: any[]) => ({
        entities,
        tariffs: action.payload.tariffs,
        supplierId: action.payload.supplierId
      })
    ),
    map(({entities, tariffs, supplierId}) => {
      const newEntities = entities.map(item => {
        if (item.id === supplierId) {
          return {...item, tariffs: this.getAggregatedTariffs(tariffs)};
        }
        return item;
      });
      return new fromActions.UpdateAllocatedSuppliers(newEntities);
    })
  ));


  deleteAllocatedSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.DELETE_ALLOCATED_SUPPLIER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBranchId)),
      (action: fromActions.DeleteAllocatedSupplier, branchId: string) => ({
        branchId,
        supplierId: action.payload
      })
    ),
    switchMap(({branchId, supplierId}) =>
      this.s.deleteSupplierFromBranch(branchId, supplierId)
        .pipe(
          map((res) => new fromActions.DeleteAllocatedSupplierSuccess(res)),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.DeleteAllocatedSupplierFailed(res.error)))
        )
    )
  ));


  updateAllocatedSupplierList$ = createEffect(() => this.actions$.pipe(
    ofType(
      fromActions.DELETE_ALLOCATED_SUPPLIER_SUCCESS,
      fromActions.ADD_NEW_SUPPLIER_BRANCH_SUCCESS
    ),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBranchId)),
      (action: fromActions.DeleteAllocatedSupplier, branchId: string) => ({branchId})
    ),
    mergeMap(({branchId}) => [new fromActions.GetAllocatedSuppliers(branchId)])
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: SupplierService
  ) {
  }

  getAggregatedTariffs(tariffs: VersionViewModel<BranchTariffViewModel>[]): AggregatedTariffViewModel[] {
    const newTar = {},
      resArr = [];

    tariffs.forEach(
      item => newTar[item.entity.id]
        ? newTar[item.entity.id].push(item)
        : newTar[item.entity.id] = [item]
    );

    Object.keys(newTar).forEach(key => {
      const last = newTar[key].reduce((prev, current) => (prev.majorVersion > current.majorVersion) ? prev : current);

      resArr.push({
        versions: newTar[key],
        id: last.id,
        name: last.entity.name,
        code: last.entity.code,
        supplyType: last.entity.supplyType,
        buildings: last.entity.buildings
      });
    });

    return resArr;
  }

  getFilteredSuppliers(entities: any, filter: number, filteredFn: Function): any {
    return (!filter || !entities)
      ? entities
      : entities.filter(supplier => filteredFn(supplier, filter));
  }

  getSortedSuppliers(suppliers: any[], order: number): any[] {
    const v = [...suppliers];
    switch (order) {
      case SupplierListOrder.NameAsc:
        return v.sort((a, b) => sortRule(a.name, b.name));
      case SupplierListOrder.NameDesc:
        return v.sort((a, b) => sortRule(b.name, a.name));
      case SupplierListOrder.AddressAsc:
        return v.sort((a, b) => sortRule(a.physicalAddressStr, b.physicalAddressStr));
      case SupplierListOrder.AddressDesc:
        return v.sort((a, b) => sortRule(b.physicalAddressStr, a.physicalAddressStr));
    }
  }
}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, flatMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {TariffAssignmentService} from '../../services/tariff-assignment.service';
import {sortRule} from '@shared-helpers';
import {
  AggregatedBuildingTariffViewModel,
  BuildingTariffViewModel,
  HistoryViewModel,
  TariffListOrder,
  VersionViewModel
} from '@models';

import * as fromActions from '../actions';
import {GetAllocatedBuildingTariffs} from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as fromCommonStore from '../../../shared/store/selectors/common-data.selectors';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';


@Injectable()
export class AllocatedTariffsEffects {

  getBuildingData$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BUILDING_DATA),
    switchMap((action: fromActions.GetBuildingData) =>
      this.s.getBuildingData(action.payload)
        .pipe(
          mergeMap((res: any) =>
            [
              new fromActions.GetBuildingDataSuccess(res),
              new fromActions.GetBuildingHistory({buildingId: action.payload})
            ]),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetBuildingDataFailed(res.error)))
        )
    )
  ));


  getAllocatedTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_ALLOCATED_BUILDING_TARIFFS),
    flatMap((action: GetAllocatedBuildingTariffs) =>
      this.s.getBuildingTariffs(action.payload.buildingId, action.payload.versionId)
        .pipe(
          mergeMap((res: any) => {
            const aggrTariffs = this.getAggregatedTariffs(res);
            return [
              new fromActions.GetAllocatedBuildingTariffsSuccess(aggrTariffs),
              new fromActions.SetAllocatedBuildingTariffsOrder(TariffListOrder.NameAsc)
            ];
          }),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetAllocatedBuildingTariffsFailed(res.error)))
        )
    )
  ));


  filterAllocatedTariffsBySupply$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_ALLOCATED_BUILDING_TARIFFS_BY_SUPPLY_FILTER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBuildingTariffs)),
      (action: fromActions.SetAllocatedBuildingTariffsBySupplyFilter, entities) => ({
        entities,
        supplier: action.payload.supplierId,
        supplyType: action.payload.supplyType
      })
    ),
    map(({entities, supplier, supplyType}) => {
        const filteredTariffs = this.getFilteredTariffs(
          [...entities],
          supplier,
          supplyType,
          (entity, supplier, supplyType) =>
            (entity.supplierId === supplier && entity.supplyType === supplyType) ||
            (entity.supplierId === supplier && supplyType === null) ||
            (supplier === '' && entity.supplyType === supplyType)
        );

        return new fromActions.UpdateAllocatedBuildingTariffs(filteredTariffs);
      }
    )
  ));


  orderAllocatedTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_ALLOCATED_BUILDING_TARIFFS_ORDER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBuildingTariffs)),
      (action: fromActions.SetAllocatedBuildingTariffsOrder, entities) => ({
        entities,
        order: action.payload
      })
    ),
    map(({entities, order}) => {
        const orderedTariffs = this.getSortedTariffs(entities, order);
        return new fromActions.UpdateAllocatedBuildingTariffs(orderedTariffs);
      }
    )
  ));



  deleteAllocatedTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.DELETE_ALLOCATED_BUILDING_TARIFF),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (action: fromActions.DeleteAllocatedBuildingTariff, buildingId: string, activeHistory: HistoryViewModel) => ({
        buildingId: buildingId,
        tariffId: action.payload,
        versionId: activeHistory && activeHistory.id
      })
    ),
    switchMap(({buildingId, tariffId, versionId}) =>
      this.s.deleteTariffFromBuilding(buildingId, tariffId, versionId)
        .pipe(
          mergeMap((res) => [
            new fromActions.GetBuildingHistory({buildingId, versionId: res.current.id}),
            new fromActions.DeleteAllocatedBuildingTariffSuccess(res),
            new fromActions.GetAllocatedBuildingTariffs({buildingId, versionId: res.current.id}),
            new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
            new commonDataActions.GetHistoryWithVersionId(res.current.id)
          ]),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.DeleteAllocatedBuildingTariffFailed(res.error)))
        )
    )
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: TariffAssignmentService
  ) {
  }

  getAggregatedTariffs(tariffs: VersionViewModel<BuildingTariffViewModel>[]): AggregatedBuildingTariffViewModel[] {
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
        id: last.entity.id,
        name: last.entity.name,
        code: last.entity.code,
        supplyType: last.entity.supplyType,
        supplierName: last.entity.supplier.name,
        supplierId: last.entity.supplier.id
      });
    });

    return resArr;
  }

  getFilteredTariffs(entities: any, supplier: string, supplyType: number, filteredFn: Function): any {
    return ((supplyType === null && (!supplier || !supplier.length)) || !entities)
      ? entities
      : entities.filter(s => filteredFn(s, supplier, supplyType));
  }

  getSortedTariffs(tariffs: any[], order: number): any[] {
    const v = [...tariffs];
    switch (order) {
      case TariffListOrder.NameAsc:
        return v.sort((a, b) => sortRule(a.name, b.name));
      case TariffListOrder.NameDesc:
        return v.sort((a, b) => sortRule(b.name, a.name));
      case TariffListOrder.VersionsAsc:
        return v.map((item) => {
          const newVersions: any = [...item.versions];
          newVersions.sort((a, b) => sortRule(a.majorVersion, b.majorVersion));
          return {...item, newVersions};
        });
      case TariffListOrder.VersionsDesc:
        return v.map((item) => {
          const newVersions: any = [...item.versions];
          newVersions.sort((a, b) => sortRule(b.majorVersion, a.majorVersion));
          return {...item, versions: newVersions};
        });
      case TariffListOrder.CreatedOnAsc:
        return v.map((item) => {
          const newVersions: any = [...item.versions];
          newVersions.sort((a, b) => sortRule(a.entity.createdOn, b.entity.createdOn));
          return {...item, newVersions};
        });
      case TariffListOrder.CreatedOnDesc:
        return v.map((item) => {
          const newVersions: any = [...item.versions];
          newVersions.sort((a, b) => sortRule(b.entity.createdOn, a.entity.createdOn));
          return {...item, versions: newVersions};
        });
      case TariffListOrder.OfAppliesAsc:
        return v.sort((a, b) => sortRule(a.applies, b.applies));
      case TariffListOrder.OfAppliesDesc:
        return v.sort((a, b) => sortRule(b.applies, a.applies));
    }
  }

  getVersionOrActual(history, versionId) {
    if (versionId) {
      return history.find(h => h.id === versionId);
    }

    let actualVersion = history.find(h => h.isActualVersion);
    if (actualVersion) {
      return actualVersion;
    }

    if (history.length) {
      return history[0];
    }

    return null;
  }
}

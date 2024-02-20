import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

import {TariffAssignmentService} from '../../services/tariff-assignment.service';
import {
  AddBuildingTariffViewModel,
  AggregatedBuildingTariffViewModel,
  BranchModel,
  BranchTariffsOrderList,
  BuildingDetailViewModel,
  CategoryViewModel,
  TariffViewModel,
  VersionViewModel
} from '@models';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';
import * as fromCommonData from '../../../shared/store/selectors/common-data.selectors';
import {BranchManagerService} from '@services';

import {sortRule} from '@shared-helpers';

@Injectable()
export class AddNewSupplierBranchEffects {

  
  getSuppliers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BRANCH_SUPPLIERS),
    switchMap((action: fromActions.GetBranchSuppliers) =>
      this.s.getBranchSuppliers(action.payload)
        .pipe(
          map((res) => new fromActions.GetBranchSuppliersSuccess(res)),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetBranchSuppliersFailed(res.error)))
        )
    )
  ));

  
  getBranchesAllCategories$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BRANCHES_ALL_CATEGORIES),
    switchMap(() =>
      this.s.getBranchesAllCategories()
        .pipe(
          map((res: CategoryViewModel[]) => new fromActions.GetBranchesAllCategoriesSuccess(res)),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetBranchesAllCategoriesFailed(res.error)))
        )
    )
  ));

  
  getBranchTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BRANCH_TARIFFS),
    withLatestFrom(
      this.branchManagerService.getBranchObservable(),
      this.store$.pipe(select(fromSelectors.selectBuildingTariffs)),
      this.store$.pipe(select(fromSelectors.selectBuildingData)),
      (
        action: fromActions.GetBranchTariffs,
        branch: BranchModel,
        buildingTariffs: AggregatedBuildingTariffViewModel[],
        buildingData: BuildingDetailViewModel
      ) => {
        return {
          branchId: branch.id,
          buildingTariffs,
          categoryIds: buildingData ? buildingData.categoryIds : []
        };
      }
    ),
    switchMap(({branchId, buildingTariffs, categoryIds}) =>
      this.s.getBranchTariffs(branchId)
        .pipe(
          mergeMap((res: VersionViewModel<TariffViewModel>[]) => {
            const tariffs = this.getAggregatedTariffs(res);
            const newRes = tariffs.map(item =>
              buildingTariffs.find(bt => bt.id === item.entity.id)
                ? ({...item, isSelected: true})
                : ({...item, isSelected: false}));
            return [
              new fromActions.GetBranchTariffsSuccess(newRes),
              new fromActions.SetBranchTariffsOrder(BranchTariffsOrderList.NameAsc)
            ];
          }),
          catchError((res: HttpErrorResponse) =>
            of(new fromActions.GetBranchTariffsFailed(res.error)))
        )
    )
  ));

  
  addTariffToBuilding$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.ADD_NEW_TARIFF_BUILDING),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBuildingData)),
      this.store$.pipe(select(fromCommonData.getSelectedVersionId)),
      (action: fromActions.AddNewTariffBuilding, buildingData: BuildingDetailViewModel, versionId: string) => ({
        buildingId: buildingData.id,
        model: action.payload,
        versionId: versionId
      })
    ),
    switchMap(({buildingId, model, versionId}) => {
        const {comment, date, actionType, entity} = model;
        const version: VersionViewModel<string[]> = new VersionViewModel(entity, comment, actionType, date, versionId);
        return this.s.addTariffToBuilding(buildingId, version)
          .pipe(
            mergeMap((res: any) => {
              return [
                new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
                new commonDataActions.GetHistoryWithVersionId(res.current.id),
                new fromActions.AddNewTariffBuildingSuccess(res),
                new fromActions.GetBuildingHistory({buildingId: buildingId, versionId: res.current.id}),
                new fromActions.GetAllocatedBuildingTariffs({buildingId: buildingId, versionId: res.current.id})
              ];
            }),
            catchError((res: HttpErrorResponse) =>
              of(new fromActions.AddNewTariffBuildingFailed(res.error)))
          );
      }
    )
  ));

  
  orderBranchTariffs$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_BRANCH_TARIFFS_ORDER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectBranchTariffs)),
      (action: fromActions.SetBranchTariffsOrder, entities) => ({
        entities,
        order: action.payload
      })
    ),
    map(({entities, order}) => {
        const orderedTariffs = this.getSortedTariffs(entities, order);
        return new fromActions.UpdateBranchTariffs(orderedTariffs);
      }
    )
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: TariffAssignmentService,
    private readonly branchManagerService: BranchManagerService
  ) {
  }

  getAggregatedTariffs(tariffVersions: VersionViewModel<TariffViewModel>[]): any {
    const newTar = {};

    tariffVersions.forEach(
      item => newTar[item.entity.id]
        ? newTar[item.entity.id].push(item)
        : newTar[item.entity.id] = [item]
    );

    return Object.keys(newTar).map(
      key =>
        newTar[key].reduce((prev, current) =>
          (prev.majorVersion > current.majorVersion)
            ? prev
            : current
        )
    );
  }

  getSortedTariffs(tariffs: AddBuildingTariffViewModel[], order: number): AddBuildingTariffViewModel[] {
    const v = [...tariffs];
    switch (order) {
      case BranchTariffsOrderList.NameAsc:
        return v.sort((a, b) => sortRule(a.entity.name, b.entity.name));
      case BranchTariffsOrderList.NameDesc:
        return v.sort((a, b) => sortRule(b.entity.name, a.entity.name));
      case BranchTariffsOrderList.SupplyTypeAsc:
        return v.sort((a, b) => sortRule(a.entity.supplyType, b.entity.supplyType));
      case BranchTariffsOrderList.SupplyTypeDesc:
        return v.sort((a, b) => sortRule(b.entity.supplyType, a.entity.supplyType));
      case BranchTariffsOrderList.AddAsc:
        return v.sort((a, b) => sortRule(a.isSelected, b.isSelected));
      case BranchTariffsOrderList.AddDesc:
        return v.sort((a, b) => sortRule(b.isSelected, a.isSelected));
    }
  }
}

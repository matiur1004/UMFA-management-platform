import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, flatMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as fromCommonStore from '../../../shared/store/selectors/common-data.selectors';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';

import {sortRule} from '@shared-helpers';
import {HistoryViewModel, VersionViewModel} from '@models';
import {TariffAssignmentService} from '../../services/tariff-assignment.service';
import {ChargesListOrder, ChargeViewModel} from '../../../shared/models';


@Injectable()
export class AdditionalChargesEffects {


  getAdditionalCharges$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_BUILDING_ADDITIONAL_CHARGES),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectAdditionalChargesOrder)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.GetBuildingAdditionalCharges,
        order: ChargesListOrder,
        activeHistory: HistoryViewModel
      ) => {
        return {
          buildingId: action.payload.buildingId,
          order,
          versionId: action.payload.versionId || activeHistory.id
        };
      }
    ),
    flatMap(({buildingId, order, versionId}) =>
      this.s.getAdditionalCharges(buildingId, versionId)
        .pipe(
          map((res: any) => {
            const orderedCharges = this.getSortedCharges(res, order);
            return new fromActions.GetBuildingAdditionalChargesSuccess(orderedCharges);
          }),
          catchError(() => of({type: 'DUMMY'}))
        )
    )
  ));

  setAdditionalChargesTariffsOrder$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SET_ADDITIONAL_CHARGE_ORDER),
    withLatestFrom(
      this.store$.pipe(select(fromSelectors.selectAdditionalCharges)),
      this.store$.pipe(select(fromSelectors.selectAdditionalChargesOrder)),
      (
        action: fromActions.SetAdditionalChargeOrder,
        charges: ChargeViewModel[],
        order: ChargesListOrder
      ) => ({
        order,
        charges
      })
    ),
    map(({order, charges}) => {
      const orderedCharges = this.getSortedCharges(charges, order);
      return new fromActions.UpdateAdditionalCharges(orderedCharges);
    })
  ));

  deleteChargeVersion$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.DELETE_ADDITIONAL_CHARGE_VERSION),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.DeleteAdditionalChargeVersion,
        buildingId: string,
        activeHistory: HistoryViewModel
      ) => ({
        buildingId: buildingId,
        chargeId: action.payload,
        versionId: activeHistory.id
      })
    ),
    switchMap(({buildingId, chargeId, versionId}) =>
      this.s.deleteCharge(buildingId, chargeId, versionId)
        .pipe(
          mergeMap((res: any) => {
            return [
              new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
              new commonDataActions.HistoryChange(res.current.id),
              new commonDataActions.GetHistoryWithVersionId(res.current.id),
              new fromActions.DeleteAdditionalChargeVersionSuccess(res)
            ];
          }),
          catchError(() => of({type: 'DUMMY'}))
        )
    )
  ));

  deleteChargeValue$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.DELETE_ADDITIONAL_CHARGE_VALUE),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      (
        action: fromActions.DeleteAdditionalChargeValue,
        buildingId: string
      ) => ({
        buildingId: buildingId,
        chargeId: action.payload.chargeId,
        valueId: action.payload.valueId
      })
    ),
    switchMap(({buildingId, chargeId, valueId}) =>
      this.s.deleteChargeValue(buildingId, chargeId, valueId)
        .pipe(
          mergeMap((res: any) => {
            return [
              new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
              new commonDataActions.HistoryChange(res.current.id),
              new commonDataActions.GetHistoryWithVersionId(res.current.id),
              new fromActions.DeleteAdditionalChargeValueSuccess(res)
            ];
          }),
          catchError(() => of({type: 'DUMMY'}))
        )
    )
  ));

  createCharge$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATE_NEW_CHARGE),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.CreateNewCharge,
        buildingId: string,
        activeHistory: HistoryViewModel
      ) => {
        return {
          buildingId: buildingId,
          model: action.payload,
          versionId: activeHistory.id
        }
      }
    ),
    switchMap(({buildingId, model, versionId}) => {
        const {comment, date, actionType, entity} = model;
        const version: VersionViewModel<string[]> = new VersionViewModel(entity, comment, actionType, date, versionId);
        return this.s.createCharge(buildingId, version)
          .pipe(
            mergeMap((res: any) => {
              return [
                new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
                new commonDataActions.HistoryChange(res.current.id),
                new commonDataActions.GetHistoryWithVersionId(res.current.id),
                new fromActions.CreateNewChargeSuccess(res.entity),
              ];
            }),
            catchError(() => of({type: 'DUMMY'}))
          );
      }
    )
  ));

  createChargeValue$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.CREATE_NEW_CHARGE_VALUE),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.CreateNewChargeValue,
        buildingid: string,
        activeHistory: HistoryViewModel
      ) => ({
        buildingId: buildingid,
        chargeId: action.payload.chargeId,
        model: action.payload,
        versionId: activeHistory.id
      })
    ),
    switchMap(({buildingId, chargeId, model, versionId}) => {
        const {comment, date, actionType, entity} = model;
        const version: VersionViewModel<string[]> = new VersionViewModel(entity, comment, actionType, date, versionId);
        return this.s.createChargeValue(buildingId, chargeId, version)
          .pipe(
            mergeMap((res: any) => {
              return [
                new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
                new commonDataActions.HistoryChange(res.current.id),
                new commonDataActions.GetHistoryWithVersionId(res.current.id),
                new fromActions.CreateNewChargeValueSuccess(res.entity)
              ];
            }),
            catchError(() => of({type: 'DUMMY'}))
          );
      }
    )
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: TariffAssignmentService
  ) {
  }

  // HELPERS
  getSortedCharges(charges: any[], order: number): any[] {
    const v = [...charges];
    switch (order) {
      case ChargesListOrder.NameAsc:
        return v.sort((a, b) => sortRule(a.name, b.name));
      case ChargesListOrder.NameDesc:
        return v.sort((a, b) => sortRule(b.name, a.name));
      case ChargesListOrder.ValueNameAsc:
        return v.map((item) => {
          const newVersions: any = [...item.additionalChargeValues];
          newVersions.sort((a, b) => sortRule(a.name, b.name));
          return {...item, additionalChargeValues: newVersions};
        });
      case ChargesListOrder.ValueNameDesc:
        return v.map((item) => {
          const newVersions: any = [...item.additionalChargeValues];
          newVersions.sort((a, b) => sortRule(b.name, a.name));
          return {...item, additionalChargeValues: newVersions};
        });
    }
  }
}

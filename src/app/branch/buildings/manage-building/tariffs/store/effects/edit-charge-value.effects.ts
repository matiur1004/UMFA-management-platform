import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {SetValueAction} from 'ngrx-forms';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromEditChargeValueReducer from '../reducers/edit-charge-value.reducer';
import * as fromCommonStore from '../../../shared/store/selectors/common-data.selectors';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';

import {TariffAssignmentService} from '../../services/tariff-assignment.service';
import {HistoryViewModel, VersionViewModel} from '@models';

@Injectable()
export class EditChargeValueEffects {

  getChargeValueData$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_CHARGE_VALUE_DATA),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.GetChargeValueData,
        activeHistory: HistoryViewModel
      ) => ({
        buildingId: action.payload.buildingId,
        chargeId: action.payload.chargeId,
        valueId: action.payload.valueId,
        versionId: activeHistory.id
      })
    ),
    switchMap(({buildingId, chargeId, valueId, versionId}) =>
      this.s.getAdditionalChargeValue(buildingId, chargeId, valueId, versionId)
        .pipe(
          mergeMap((res) => [
            new SetValueAction(fromEditChargeValueReducer.FORM_ID, {editValue: res}),
            new fromActions.GetChargeValueDataSuccess(res)
          ]),
          catchError((res: HttpErrorResponse) =>
            of({type: 'DUMMY'}))
        )
    )
  ));

  updateChargeValue$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.UPDATE_CHARGE_VALUE),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedHistoryLog)),
      (
        action: fromActions.UpdateChargeValue,
        buildingId: string,
        activeHistory: HistoryViewModel
      ) => ({
        buildingId: buildingId,
        versionId: activeHistory.id,
        chargeId: action.payload.chargeId,
        valueId: action.payload.valueId,
        model: action.payload
      })
    ),
    switchMap(({buildingId, versionId, chargeId, valueId, model}) => {
      const {comment, date, actionType, entity} = model;
      const version: VersionViewModel<string[]> = new VersionViewModel(entity, comment, actionType, date, versionId);
      return this.s.updateChargeValue(buildingId, chargeId, valueId, version)
        .pipe(
          mergeMap((res) => [
            new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
            new commonDataActions.HistoryChange(res.current.id),
            new commonDataActions.GetHistoryWithVersionId(res.current.id),
            new fromActions.UpdateChargeValueSuccess(res)
          ]),
          catchError((res: HttpErrorResponse) => of({type: 'DUMMY'})));
    })
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: TariffAssignmentService
  ) {
  }
}

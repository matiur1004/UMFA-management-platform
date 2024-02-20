import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SetValueAction} from 'ngrx-forms';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import * as fromReducers from '../reducers';
import * as fromEditChargeVersionReducer from '../reducers/edit-charge-version.reducer';
import * as fromActions from '../actions';
import * as fromCommonStore from '../../../shared/store/selectors/common-data.selectors';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';

import {TariffAssignmentService} from '../../services/tariff-assignment.service';
import {VersionViewModel} from '@models';
import {ActivatedRoute} from '@angular/router';

@Injectable()
export class EditChargeVersionEffects {

  getChargeVersion$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_CHARGE_DATA),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getSelectedVersionId)),
      (
        action: fromActions.GetChargeData,
        versionId: string
      ) => ({
        buildingId: action.payload.buildingId,
        chargeId: action.payload.chargeId,
        versionId: versionId
      })
    ),
    switchMap(({buildingId, chargeId, versionId}) =>
      this.s.getAdditionalCharge(buildingId, chargeId, versionId)
        .pipe(
          mergeMap((res) => [
            new SetValueAction(fromEditChargeVersionReducer.FORM_ID, {charge: res}),
            new fromActions.GetChargeDataSuccess(res),
            new fromActions.GetEquipmentRegisters()
          ]),
          catchError((res: HttpErrorResponse) =>
            of({type: 'DUMMY'}))
        )
    )
  ));

  getEquipmentRegisters$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_EQUIPMENT_REGISTERS),
    switchMap((action: fromActions.GetEquipmentRegisters) =>
      this.s.getAllRegisters(action.payload)
        .pipe(
          map((res) => new fromActions.GetEquipmentRegistersSuccess(res)),
          catchError((res: HttpErrorResponse) => of({type: 'DUMMY'})))
    )
  ));

  updateCharge$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.UPDATE_CHARGE_VERSION),
    withLatestFrom(
      this.store$.pipe(select(fromCommonStore.getBuildingId)),
      this.store$.pipe(select(fromCommonStore.getSelectedVersionId)),
      (
        action: fromActions.UpdateChargeVersion,
        buildingId: string,
        versionId: string
      ) => ({
        buildingId: buildingId,
        versionId: versionId,
        chargeId: action.payload.chargeId,
        model: action.payload
      })
    ),
    switchMap(({buildingId, versionId, chargeId, model}) => {
        const {comment, date, actionType, entity} = model;
        const version: VersionViewModel<string[]> = new VersionViewModel(entity, comment, actionType, date, versionId);
        return this.s.updateCharge(buildingId, chargeId, version)
          .pipe(
            mergeMap((res) => [
              new commonDataActions.UpdateUrlVersionAction(res.current.versionDate),
              new commonDataActions.HistoryChange(res.current.id),
              new commonDataActions.GetHistoryWithVersionId(res.current.id),
              new fromActions.UpdateChargeVersionSuccess(res)
            ]),
            catchError((res: HttpErrorResponse) => of({type: 'DUMMY'})));
      }
    )
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: TariffAssignmentService,
    private readonly route: ActivatedRoute
  ) {
  }
}

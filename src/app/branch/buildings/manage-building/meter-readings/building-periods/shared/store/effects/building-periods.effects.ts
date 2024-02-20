import {FinalizeBuildingPeriodResult} from './../../../../../shared/enums/finalize-bulding-period-result';
import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import {Action, select, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {box, DisableAction, EnableAction, MarkAsSubmittedAction, SetValueAction, unbox} from 'ngrx-forms';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';
import * as fromMeterReadings from '../../../../billing-readings/shared/store/reducers';
import * as fromBuildingPeriodForm from '../reducers/building-period-form.store';
import * as fromCommonDataAction from '../../../../../shared/store/actions/common-data.action';
import * as buildingPeriodsAction from '../actions/building-periods.actions';
import * as buildingPeriodFormAction from '../actions/building-period-form.actions';
import * as nodeApplyNewTariffVersionsAction
  from '../../../../../building-equipment/shared/store/actions/node-apply-new-tariff-versions.action';
import {BuildingPeriodsService} from '../../../../../shared/services/building-periods.service';
import {EditDialogModeEnum} from '../../models/edit-dialog-mode.enum';
import {parseAsUTCDate} from 'app/shared/helper/date-extension';
import {getMonthDateFromName, getMonthYearName} from '../../helpers/date.helper';

const getPeriodName = (previousName, startDate) => {
  const previousNameDate = getMonthDateFromName(previousName);
  if (previousNameDate &&
    Math.abs(previousNameDate.getFullYear() * 12 + previousNameDate.getMonth() + 1 - startDate.getFullYear()
      * 12 - startDate.getMonth()) <= 2) {
    return getMonthYearName(previousNameDate, 1);
  } else {
    return getMonthYearName(startDate);
  }
};

@Injectable()
export class BuildingPeriodsEffects {
  getBuildingPeriods: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      buildingPeriodsAction.GET_BUILDING_PERIODS,
      buildingPeriodsAction.SET_PAGE,
      buildingPeriodsAction.SET_SEARCH_FILTER,
      buildingPeriodsAction.SET_PAGE_SIZE),
    withLatestFrom(this.store$.pipe(select(fromMeterReadings.getBuildingPeriodsState)),
      this.store$.pipe(select(commonData.getBuildingId)), (_, state, buildingId) => {
        return {
          state: state,
          buildingId: buildingId
        };
      }),
    switchMap((action: any) => {
      const state = action.state;
      const page = state.page || 0;
      const pageSize = state.pageSize || null;

      return this.buildingPeriodsService.get(action.buildingId, state.searchFilter, page * pageSize, pageSize).pipe(
        map((r: any) => new buildingPeriodsAction
          .BuildingPeriodsLoaded({buildingPeriods: r.items, total: r.total})),
        catchError(() => of({type: 'DUMMY'}))
      );
    })));
  getBuildingPeriodsShort: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodsAction.GET_BUILDING_PERIODS),
    withLatestFrom(this.store$.pipe(select(fromMeterReadings.getBuildingPeriodsState)),
      this.store$.pipe(select(commonData.getBuildingId)), (_, state, buildingId) => {
        return {
          state: state,
          buildingId: buildingId
        };
      }),
    switchMap((action: any) => {
      return this.buildingPeriodsService.getAllShort(action.buildingId).pipe(
        map(r => new buildingPeriodsAction.BuildingPeriodsReferenceLoaded(r)),
        catchError(() => of({type: 'DUMMY'}))
      );
    })));
  rollbackBuildingPeriod: Observable<Action | Action[]> = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodsAction.ROLLBACK_BUILDING_PERIOD),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      (action: any,
       buildingId) => {
        return {
          id: action.payload,
          buildingId: buildingId,
        };
      }),
    switchMap((action: any) => {
      return this.buildingPeriodsService.rollback(action.buildingId, action.id).pipe(
        mergeMap(() => {
          return [
            new buildingPeriodFormAction.EditBuildingPeriodCompleted(),
            new buildingPeriodsAction.GetBuildingPeriods(),
          ];
        }),
        catchError(() => of({type: 'DUMMY'}))
      );
    })));
  saveBuildingPeriod = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodFormAction.SAVE_BUILDING_PERIOD),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromMeterReadings.getFormState)),
      this.store$.pipe(select(fromMeterReadings.getBuildingPeriodsEditDialogMode)),
      (action: any, buildingId, formState) => {
        return {model: action.payload, buildingId: buildingId, formState: formState};
      }),
    switchMap((action: any) => {
      if (action.formState.formState.isInvalid) {
        return [new MarkAsSubmittedAction(fromBuildingPeriodForm.FORM_ID)];
      }
      const formValue = action.formState.formState.value;
      const model = {
        id: formValue.id,
        buildingId: action.buildingId,
        name: formValue.name,
        clientStatementName: formValue.clientStatementName,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        isFinalized: false,
        linkedBuildingPeriodIds: unbox(formValue.linkedBuildingPeriodIds)
      };
      const editMode = action.formState.editMode;

      let saveRequest: Observable<any>;
      if (editMode === EditDialogModeEnum.Finalize) {
        saveRequest = this.buildingPeriodsService.finalize(action.buildingId, model.id, model);
      } else {
        saveRequest = this.buildingPeriodsService.save(action.buildingId, model.id, model);
      }

      return saveRequest.pipe(
        mergeMap(finalizationResult => {
          const actions: Action[] = [new buildingPeriodFormAction.EditBuildingPeriodCompleted(),
            new buildingPeriodsAction.GetBuildingPeriods(),
            new fromCommonDataAction.GetActiveBuildingPeriod({buildingId: model.buildingId}),
            new fromCommonDataAction.GetHistoryWithVersionId(null)
          ];

          if (finalizationResult === FinalizeBuildingPeriodResult.FinalizedWithNewNodeTariffVersions) {
            actions.push(new nodeApplyNewTariffVersionsAction.ShowNodeTariffsAppliedPopup());
          }

          return actions;
        }),
        catchError(() => of({type: 'DUMMY'})));
    })
  ));
  editBuildingPeriodCompleted: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodFormAction.EDIT_BUILDING_PERIOD_COMPLETED),
    withLatestFrom(this.store$.pipe(select(fromMeterReadings.getBuildingPeriodsEditModalRef)),
      (action, modalRef: NgbModalRef) => ({modalRef: modalRef})),
    switchMap((action) => {
      action.modalRef?.close();
      return of({type: 'DUMMY'});
    })));
  startFinalizeBuildingPeriod: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodFormAction.FINALIZE_BUILDING_PERIOD),
    withLatestFrom(this.store$.pipe(select(fromMeterReadings.getLatestBuildingPeriod)),
      this.store$.pipe(select(fromMeterReadings.getBuildingPeriodReferences)),
      this.store$.pipe(select(fromMeterReadings.getForm)),
      (action, latestPeriod, previousPeriods, formState) =>
        ({period: latestPeriod, previousPeriods: previousPeriods, formState: formState})),
    switchMap((action: any) => {
      const period = action.period;
      const startDate = parseAsUTCDate(period.endDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);

      const offset = endDate.getTimezoneOffset() * (-1);
      endDate.setMinutes(offset);

      const clientSatementName = getPeriodName(period.clientStatementName, startDate);
      const name = getPeriodName(period.name, startDate);

      const linkedPeriods = [];
      const monthName = name.split(' ')[0].toLowerCase();
      if (monthName) {
        const relatedPeriod = action.previousPeriods.find(p => p.id !== period.id && p.name.toLowerCase().indexOf(monthName) >= 0);
        if (relatedPeriod) {
          linkedPeriods.push(relatedPeriod.id);
        }
      }
      if (linkedPeriods.length < 1) {
        const relatedPeriod = action.previousPeriods.find(p => {
          const pStartDate = parseAsUTCDate(p.startDate);
          return pStartDate.getMonth() === startDate.getMonth() && pStartDate.getFullYear() + 1 === startDate.getFullYear();
        });
        if (relatedPeriod) {
          linkedPeriods.push(relatedPeriod.id);
        }
      }

      const finalizePeriodModel = {
        id: period.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        name: name,
        clientStatementName: clientSatementName,
        linkedBuildingPeriodIds: box(linkedPeriods)
      };

      return [new SetValueAction(fromBuildingPeriodForm.FORM_ID, finalizePeriodModel),
        new DisableAction(action.formState.controls.startDate.id)];
    })
  ));
  startEditBuildingPeriod: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingPeriodFormAction.EDIT_BUILDING_PERIOD),
    withLatestFrom(
      this.store$.pipe(select(fromMeterReadings.getLatestBuildingPeriod)),
      this.store$.pipe(select(fromMeterReadings.getPreviousBuildingPeriod)),
      this.store$.pipe(select(fromMeterReadings.getForm)),
      (action, latestPeriod, previousPeriod, formState) => {
        return {latestPeriod: latestPeriod, previousPeriodExists: !!previousPeriod, formState: formState};
      }),
    switchMap((action: any) => {
      const period = action.latestPeriod;
      const editPeriod = {
        id: period.id,
        startDate: period.startDate,
        endDate: period.endDate,
        name: period.name,
        clientStatementName: period.clientStatementName,
        linkedBuildingPeriodIds: box(period.linkedBuildingPeriodIds)
      };

      const startDateAction = action.previousPeriodExists ?
        new DisableAction(action.formState.controls.startDate.id)
        : new EnableAction(action.formState.controls.startDate.id);
      return [new SetValueAction(fromBuildingPeriodForm.FORM_ID, editPeriod), startDateAction];
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromMeterReadings.State>,
    private buildingPeriodsService: BuildingPeriodsService
  ) {
  }
}

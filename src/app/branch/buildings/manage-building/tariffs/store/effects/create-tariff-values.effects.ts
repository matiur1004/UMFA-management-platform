import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import * as createTariffValuesActions from '../actions/tariff-values.actions';
import {Router} from '@angular/router';
import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddVersionValueComponent} from 'app/shared/tariffs/tariff-values/add-version-value/add-version-value.component';
import {BranchManagerService} from '@services';
import * as tariffFormActions from '../../store/actions/tariff-details.actions';
import {TariffValueInfoViewModel} from '@app/shared/models';
import {addDays, convertDateToNgbDate} from '@app/shared/helper';

@Injectable()
export class BuildingCreateTariffValueEffects {

  addNewTariffValue$ = createEffect(() => this.actions$.pipe(
    ofType(createTariffValuesActions.CREATE_TARIFF_VALUE_ADD_NEW_VALUE),
    switchMap((action: createTariffValuesActions.CreateTariffValueAddNewValue) => {
      const tariffVersion = action.payload.tariffVersion;

      if (tariffVersion) {
        const sortRule = (a, b) => (a > b) ? 1 : (a < b) ? -1 : 0;
        const sortedTariffValues = (tariffVersion.entity.tariffValues || []).sort((a, b) =>
          sortRule(a.majorVersion, b.majorVersion) || sortRule(a.minorVersion, b.minorVersion));

        let newValueStartDate = new Date(tariffVersion.versionDate);
        const lastActualTariffValueVersion = sortedTariffValues.length ? sortedTariffValues[sortedTariffValues.length - 1] : null;

        if (lastActualTariffValueVersion) {
          newValueStartDate = new Date(lastActualTariffValueVersion.endDate);
        }

        const minValueEndDate = new Date(newValueStartDate);
        minValueEndDate.setDate(minValueEndDate.getDate() + 1);

        const modal = this.modalService.open(AddVersionValueComponent, {
          backdrop: 'static',
          windowClass: 'add-tariff-dets-modal'
        });
        modal.componentInstance.lastTariffValueEndDate = newValueStartDate;
        modal.componentInstance.minEndDateForNewTariffValue = convertDateToNgbDate(minValueEndDate);
        modal.componentInstance.lineItems = tariffVersion.entity.lineItems.map(item => ({
          ...item,
          lineItemId: item.id
        }));
        modal.componentInstance.tariff = {
          version: tariffVersion.version,
          versionDate: tariffVersion.versionDate,
          name: tariffVersion.entity.name
        };
        modal.componentInstance.updateLineItemControls();
        modal.result.then((data) => {
            this.store$.dispatch(new createTariffValuesActions.ApiCreateTariffValue({
              ...data,
              tariffVersionId: tariffVersion.id,
              baseTariffValueId: lastActualTariffValueVersion?.versionId
            }))
          },
          (e) => {/* closed - do nothing */
          });
      }

      return of({type: 'DUMMY'})
    }),
  ));

  addNewTariffValueInitForm$ = createEffect(() => this.actions$.pipe(
    ofType(createTariffValuesActions.CREATE_TARIFF_VALUE_FORM_INIT),
    withLatestFrom(
      this.store$.pipe(select(selectors.getTariffForm)),
      this.store$.pipe(select(selectors.getTariffValuesSorted))
    ),
    tap(([action, tariff, tariffValues]: [createTariffValuesActions.CreateTariffValueFormInit, any, TariffValueInfoViewModel[]]) => {
      let nextAvailableDate: Date;

      if (tariffValues.length) {
        nextAvailableDate = tariffValues.reduce((max, tariffValue) => (tariffValue.endDate > max ? tariffValue.endDate : max), tariffValues[0].endDate);
      } else {
        nextAvailableDate = tariff.value.versionDate;
      }

      if (!nextAvailableDate) {
        nextAvailableDate = new Date(action.payload.versionMainInfo.versionDate);
      }

      if (!tariff.value.versionId) {
        tariff.value = action.payload.versionMainInfo.currentTariff;
        tariff.value.name = action.payload.versionMainInfo.versionTariffName;
        tariff.value.versionId = action.payload.versionMainInfo.versionId;
        tariff.value.versionDate = action.payload.versionMainInfo.versionDate;
        tariff.value.majorVersion = action.payload.versionMainInfo.versionMajorVersion;
      }

      let minEndDateForNewTariffValue = new Date(nextAvailableDate);

      let modal = this.modalService.open(AddVersionValueComponent, {
        backdrop: 'static',
        windowClass: 'add-tariff-dets-modal'
      });

      minEndDateForNewTariffValue = addDays(nextAvailableDate, 1);

      modal.componentInstance.lastTariffValueEndDate = nextAvailableDate;
      modal.componentInstance.minEndDateForNewTariffValue = convertDateToNgbDate(minEndDateForNewTariffValue);
      modal.componentInstance.lineItems = action.payload.lineItems;
      modal.componentInstance.tariff = tariff.value;
      modal.componentInstance.updateLineItemControls();
      modal.result.then((data) => {

          let tariffValueVersion = {
            isNewVersion: false,
            postUpdateActions: [
              new createTariffValuesActions.ApiCreateTariffValue({
                ...data,
                tariffVersionId: action.payload.tariffVersionId,
                baseTariffValueId: action.payload.baseTariffValueId
              })
            ]
          }

          this.store$.dispatch(new tariffFormActions.SendTariffRequest({
            tariffValueVersion: tariffValueVersion,
            currTariff: action.payload.versionMainInfo?.currentTariff,
            isSubVersion: false
          }));
        },
        (e) => {/* closed - do nothing */
        });
    })
  ), {dispatch: false});

  apiCreateTariffValue$ = createEffect(() => this.actions$.pipe(
    ofType(createTariffValuesActions.API_CREATE_TARIFF_VALUE),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      of(this.branchManager.getBranchId())
    ),
    mergeMap(([action, buildingId, branchId]: [createTariffValuesActions.ApiCreateTariffValue, string, string]) => {
      const model = action.payload;
      return this.tariffService.createTariffValueIncrese(model.tariffVersionId, model, buildingId).pipe(
        map((id) => new createTariffValuesActions.ApiCreateTariffValueSuccess({
          buildingId,
          branchId: branchId,
          tariffVersionId: model.tariffVersionId,
          tariffValueVersionId: id
        })),
        catchError(r => {
          return of(new createTariffValuesActions.ApiCreateTariffValueFailed(r.error));
        })
      );

    })
  ));

  apiCreateTariffValueVersion$ = createEffect(() => this.actions$.pipe(
    ofType(createTariffValuesActions.CREATE_TARIFF_VALUE_VERSION),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      of(this.branchManager.getBranchId()),
      (action: createTariffValuesActions.CreateTariffValueVersion, buildingId: string, branchId: string) => {
        return {
          tariffVersionId: action.payload.tariffVersionId,
          tariffValueId: action.payload.tariffValueId,
          buildingId: buildingId,
          branchId: branchId
        };
      }),
    switchMap(({buildingId, tariffValueId, tariffVersionId, branchId}) => {
      return this.tariffService.createTariffValueVersion(tariffVersionId, tariffValueId, buildingId).pipe(
        map((id) => new createTariffValuesActions.ApiCreateTariffValueSuccess({
          tariffVersionId: tariffVersionId,
          tariffValueVersionId: id,
          buildingId: buildingId,
          branchId: branchId
        })),
        catchError(r => {
          return of(new createTariffValuesActions.ApiCreateTariffValueFailed(r.error));
        })
      );
    })
  ));

  apiCreateTariffValueSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(createTariffValuesActions.API_CREATE_TARIFF_VALUE_SUCCESS),
    tap((action: any) => {
      this.router.navigate([
        '/branch', action.payload.branchId,
        'buildings', action.payload.buildingId,
        'tariffs', 'building-tariffs', action.payload.tariffVersionId,
        'values', action.payload.tariffValueVersionId]);
    })));

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly store$: Store<fromTariff.State>,
    private readonly tariffService: BuildingTariffsService,
    private readonly branchManager: BranchManagerService
  ) {
  }
}

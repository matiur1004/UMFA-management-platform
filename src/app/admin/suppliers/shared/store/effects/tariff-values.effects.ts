import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {createEffect} from '@ngrx/effects';
 
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import {TariffService} from '../../services/tariff.service';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import * as fromTariffValuesActions from '../actions/tariff-values.actions';
import * as tariffFormActions from '../../../shared/store/actions/tariff-form.actions';

import {addDays, convertDateToNgbDate, sortRule} from '@shared-helpers';
import {AddVersionValueComponent} from 'app/shared/tariffs';
import {TariffValueVersionInfoViewModel} from '@app/shared/models';

@Injectable()
export class TariffValuesEffects {

  getTariffValue$ = createEffect(() => 
    this.actions$.pipe(
      ofType(fromTariffValuesActions.GET_TARIFF_VALUES),
      switchMap((action: fromTariffValuesActions.GetTariffValues) =>
        this.tariffService.getTariffValue(action.payload)
          .pipe(
            mergeMap((res) => {
              res.entity.lineItemValues = res.entity.lineItemValues.map(l => {
                if (l.stepSchema) {
                  l.stepSchema.ranges.sort((a, b) => sortRule(a.from, b.from));
  
                  l.values.sort(
                    (a, b) => 
                      l.stepSchema.ranges
                        .findIndex(i => i.id === a.stepRangeId) -
                      l.stepSchema.ranges
                        .findIndex(i => i.id === b.stepRangeId)
                  );
                }
                return l;
              });
  
              return [
                new fromTariffValuesActions.GetTariffValuesSuccess(res)
              ];
            }),
            catchError((res: HttpErrorResponse) => {
              return of(new fromTariffValuesActions.GetTariffValuesFailed(res.error));
            })
          )
      )
    )
  );

  updateTariffValue$ = createEffect(() => 
    this.actions$.pipe(
      ofType(fromTariffValuesActions.UPDATE_TARIFF_VALUES),
      switchMap((action: fromTariffValuesActions.UpdateTariffValues) =>
        this.tariffService.updateTariffValue(action.payload)
          .pipe(
            map(() => new fromTariffValuesActions.UpdateTariffValuesSuccess()),
            catchError((res: HttpErrorResponse) =>
              of(new fromTariffValuesActions.UpdateTariffValuesFailed(res.error)))
          )
      )
    )
  );

  apiCreateTariffValue$ = createEffect(() => 
    this.actions$.pipe(
      ofType(fromTariffValuesActions.API_CREATE_TARIFF_VALUE),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId))),
      mergeMap(([action, supplierId]: [fromTariffValuesActions.ApiCreateTariffValue, string]) => {
        const model = action.payload;
        return this.tariffService.createTariffValueIncrese(supplierId, model.tariffVersionId, model).pipe(
          map((id) => new fromTariffValuesActions.ApiCreateTariffValueSuccess({
            supplierId,
            tariffVersionId: model.tariffVersionId,
            tariffValueVersionId: id
          })),
          catchError(r => {
            return of(new fromTariffValuesActions.ApiCreateTariffValueFailed(r.error));
          })
        );
      })
    )
  );

  apiCreateTariffValueVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.CREATE_TARIFF_VALUE_VERSION),
      withLatestFrom(
        this.store$.pipe(select(selectors.getSupplierId)),
        (action: fromTariffValuesActions.CreateTariffValueVersion, supplierId: string) => {
          return {
            tariffVersionId: action.payload.tariffVersionId,
            tariffValueId: action.payload.tariffValueId,
            supplierId: supplierId,
          };
        }),
      switchMap(({supplierId, tariffValueId, tariffVersionId}) => {
        return this.tariffService.createTariffValueVersion(tariffVersionId, tariffValueId).pipe(
          map((id) => new fromTariffValuesActions.ApiCreateTariffValueSuccess({
            tariffVersionId: tariffVersionId,
            tariffValueVersionId: id,
            supplierId: supplierId
          })),
          catchError(r => {
            return of(new fromTariffValuesActions.ApiCreateTariffValueFailed(r.error));
          })
        );
      })
    )
  );

  apiCreateTariffValueSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.API_CREATE_TARIFF_VALUE_SUCCESS),
      tap((action: any) => {
        this.router.navigate(['admin', 'suppliers', action.payload.supplierId,
          'tariffs', action.payload.tariffVersionId,
          'values', action.payload.tariffValueVersionId]);
      })
    ),
    { dispatch: false }
  );

  deleteTariffValuesVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.DELETE_TARIFF_VALUES_VERSION_REQUEST),
      switchMap((action: fromTariffValuesActions.DeleteTariffValuesVersionRequest) => {
        const {tariffVersionId, tariffValueVersionId} = action.payload;
        return this.tariffService.deleteTariffValuesVersion(tariffVersionId, tariffValueVersionId)
          .pipe(
            map(() => {
              return new fromTariffValuesActions.DeleteTariffValuesVersionRequestComplete({
                tariffVersionId,
                tariffValueVersionId
              });
            }),
            catchError(() => {
              return of({type: 'DUMMY'});
            })
          )
      })
    )
  );

  deleteTariffValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.DELETE_TARIFF_VALUE_REQUEST),
      switchMap((action: fromTariffValuesActions.DeleteTariffValueRequest) => {
        const {tariffVersionId, tariffValueId} = action.payload;
        return this.tariffService.deleteTariffValue(tariffVersionId, tariffValueId)
          .pipe(
            map(() => {
              return new fromTariffValuesActions.DeleteTariffValueRequestComplete({tariffValueId: tariffValueId});
            }),
            catchError(() => {
              return of({type: 'DUMMY'});
            })
          )
      })
    )
  );

  addNewTariffValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.CREATE_TARIFF_VALUE_ADD_NEW_VALUE),
      switchMap((action: fromTariffValuesActions.CreateTariffValueAddNewValue) => {
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
              this.store$.dispatch(new fromTariffValuesActions.ApiCreateTariffValue({
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
    )
  );

  addNewTariffValueInitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromTariffValuesActions.CREATE_TARIFF_VALUE_FORM_INIT),
      withLatestFrom(
        this.store$.pipe(select(selectors.getTariffFormLineItems)),
        this.store$.pipe(select(selectors.getTariffForm)),
        this.store$.pipe(select(selectors.getTariffValuesSorted))
      ),
      tap(([action, lineItems, tariff, tariffValues]: [fromTariffValuesActions.CreateTariffValueFormInit, any, any, TariffValueVersionInfoViewModel[]]) => {
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
        const modal = this.modalService.open(AddVersionValueComponent, {
          backdrop: 'static',
          windowClass: 'add-tariff-dets-modal'
        });

        minEndDateForNewTariffValue = addDays(nextAvailableDate, 1);

        modal.componentInstance.lastTariffValueEndDate = nextAvailableDate;
        modal.componentInstance.minEndDateForNewTariffValue = convertDateToNgbDate(minEndDateForNewTariffValue);
        modal.componentInstance.lineItems = lineItems;
        modal.componentInstance.tariff = tariff.value;
        modal.componentInstance.updateLineItemControls();
        modal.result.then((data) => {
            const tariffValueVersion = {
              isNewVersion: false,
              postUpdateActions: [
                new fromTariffValuesActions.ApiCreateTariffValue({
                  ...data,
                  tariffVersionId: action.payload.tariffVersionId,
                  baseTariffValueId: action.payload.baseTariffValueId
                })
              ]
            };

            this.store$.dispatch(new tariffFormActions.SendTariffRequest({
              tariffValueVersion: tariffValueVersion,
              currTariff: action.payload.versionMainInfo?.currentTariff,
              isSubVersion: false
            }));
          },
          (e) => {/* closed - do nothing */
          });
      })
    ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly store$: Store<fromTariff.State>,
    private readonly tariffService: TariffService
  ) {
  }
}

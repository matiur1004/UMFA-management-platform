import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import * as fromTariffValuesActions from '../actions/tariff-values.actions';
import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {sortRule} from '@shared-helpers';

@Injectable()
export class BuildingTariffValuesEffects {

  getTariffValue$ = createEffect(() => this.actions$.pipe(
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
              new fromTariffValuesActions.GetTariffValuesSuccess(res),
            ];
          }),
          catchError((res: HttpErrorResponse) =>
            of(new fromTariffValuesActions.GetTariffValuesFailed(res.error)))
        )
    )
  ));


  updateTariffValue$ = createEffect(() => this.actions$.pipe(
    ofType(fromTariffValuesActions.UPDATE_TARIFF_VALUES),
    switchMap((action: fromTariffValuesActions.UpdateTariffValues) =>
      this.tariffService.updateTariffValue(action.payload)
        .pipe(
          map(() => new fromTariffValuesActions.UpdateTariffValuesSuccess()),
          catchError((res: HttpErrorResponse) =>
            of(new fromTariffValuesActions.UpdateTariffValuesFailed(res.error)))
        )
    )
  ));


  deleteTariffValuesVersion$ = createEffect(() => this.actions$.pipe(
    ofType(fromTariffValuesActions.DELETE_TARIFF_VALUES_VERSION_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      this.store$.pipe(select(selectors.getTariffValuesSorted)),
      (action: any, buildingId: string) => {
        return {
          tariffVersionId: action.payload.tariffVersionId,
          buildingId: buildingId,
          tariffValueVersionId: action.payload.tariffValueVersionId
        };
      }
    ),
    mergeMap(({buildingId, tariffVersionId, tariffValueVersionId}) =>
      this.tariffService.deleteTariffValuesVersion(tariffVersionId, tariffValueVersionId, buildingId)
        .pipe(
          map(() => {
            return new fromTariffValuesActions.DeleteTariffValuesVersionRequestComplete({
              tariffVersionId,
              valueVersionId: tariffValueVersionId
            });
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        )
    )
  ));


  deleteTariffValue$ = createEffect(() => this.actions$.pipe(
    ofType(fromTariffValuesActions.DELETE_TARIFF_VALUE_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      (action: fromTariffValuesActions.DeleteTariffValueRequest, buildingId: string) => {
        return {
          tariffVersionId: action.payload.tariffVersionId,
          buildingId: buildingId,
          tariffValueId: action.payload.tariffValueId
        };
      }
    ),
    switchMap(({tariffVersionId, tariffValueId, buildingId}) => {
      return this.tariffService.deleteTariffValue(tariffVersionId, tariffValueId, buildingId)
        .pipe(
          map(() => {
            return new fromTariffValuesActions.DeleteTariffValueRequestComplete({tariffValueId: tariffValueId});
          }),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        )
    })
  ));


  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromTariff.State>,
    private readonly tariffService: BuildingTariffsService
  ) {
  }
}

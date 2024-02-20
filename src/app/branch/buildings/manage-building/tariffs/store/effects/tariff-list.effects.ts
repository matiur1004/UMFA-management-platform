import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {select, Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import * as tariffActions from '../actions/tariff.actions';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

@Injectable()
export class TariffListEffects {
  // Get aggregated list of tariffs
  getTariffs = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.REQUEST_TARIFF_LIST),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      this.store$.pipe(select(selectors.getTariffState))),
    switchMap(([_, buildingId, state]) => {
      const tariffs = this.tariffService.getAllTariffs(buildingId, state.searchKey,
        state.supplyTypeFilter, state.order, state.buildingCategoryId);

      return tariffs.pipe(
        mergeMap((tariff) => [new tariffActions.RequestTariffListComplete(tariff)]),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Update search key
  updateSearchKey: Observable<tariffActions.Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.UPDATE_SEARCH_KEY),
    debounceTime(300),
    map((action) => {
      return new tariffActions.RequestTariffList();
    })
  ));
  // Update supplyType, buildingCategory
  updateSupplyTypeBuildingCategory: Observable<tariffActions.Action> = createEffect(() => this.actions$.pipe(
    ofType(tariffActions.UPDATE_SUPPLY_TYPE_FILTER, tariffActions.UPDATE_BUILDING_CATEGORY_ID),
    map((action) => {
      return new tariffActions.RequestTariffList();
    })
  ));

  constructor(private readonly actions$: Actions,
              private readonly store$: Store<fromTariff.State>,
              private readonly tariffService: BuildingTariffsService) {
  }

}

import {BuildingTariffsService} from '../../services/building-tariffs.service';
import {select, Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import * as costProviderNodesActions from '../actions/cost-provider-nodes.actions';
import * as fromTariff from '../reducers';
import * as selectors from '../selectors';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

@Injectable()
export class CostProviderNodesEffects {
  // Get aggregated list of tariffs
  getTariffs = createEffect(() => this.actions$.pipe(
    ofType(costProviderNodesActions.REQUEST_COST_PROVIDER_NODES),
    withLatestFrom(
      this.store$.pipe(select(selectors.getBuildingId)),
      this.store$.pipe(select(selectors.getTariffForm))),
    switchMap(([_, buildingId, tariffForm]) => {
      const supplyType = tariffForm.value.supplyType;
      const nodes = this.tariffService.getCostProviderNodes(buildingId, supplyType);

      return nodes.pipe(
        mergeMap((nodes) => [new costProviderNodesActions.RequestCostProviderNodesComplete(nodes)]),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private readonly actions$: Actions,
              private readonly store$: Store<fromTariff.State>,
              private readonly tariffService: BuildingTariffsService) {
  }
}

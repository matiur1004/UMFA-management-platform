import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as replaceNodeTariffActions
  from '../../actions/replace-equipment-wizard-actions/replace-node-tariff-step.actions';
import * as replaceWizardSelector from '../../selectors/replace-wizard-selectors/replace-wizard.selector';

import {NodeService} from '../../../node.service';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';

@Injectable()
export class ReplaceNodeTariffStepEffects {

  // get nodes
  getNodes = createEffect(() => this.actions$.pipe(
    ofType(replaceNodeTariffActions.GET_NODE_REQUEST),
    withLatestFrom(this.store$.pipe(select(replaceWizardSelector.getMeterId)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, meterId, buildingId, versiongId) =>
        ({meterId: meterId, buildingId: buildingId, versionId: versiongId})),
    switchMap(({meterId, buildingId, versionId}) => {
      return this.nodeService.getNodesByMeter(buildingId, meterId, versionId).pipe(
        map(result => new replaceNodeTariffActions.GetNodeRequestComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  private readonly supplyTypeDefaultValue = -1;

  // get tariffs
  getTariffs = createEffect(() => this.actions$.pipe(
    ofType(replaceNodeTariffActions.GET_TARIFFS_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId: buildingId, versionId: versionId})),
    switchMap(({buildingId, versionId}) => {
      return this.nodeService.getTariffsForBuilding(buildingId, this.supplyTypeDefaultValue, versionId).pipe(
        map(result => new replaceNodeTariffActions.GetTariffsRequestComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<any>, private nodeService: NodeService) {
  }

}


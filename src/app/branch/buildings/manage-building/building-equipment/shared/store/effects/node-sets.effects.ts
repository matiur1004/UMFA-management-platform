import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as nodeSetsAction from '../actions/node-sets.actions';
import * as fromNodeSets from '../reducers';
import {NodeSetsService} from '../../node-sets.service';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

@Injectable()
export class NodeSetsEffects {

  // Get nodes
  getNodeSetsRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeSetsAction.REQUEST_NODE_SETS_LIST),
    withLatestFrom(
      this.store$.select(fromNodeSets.getNodeState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, nodeState, buildingId, versionId) => {
        return {
          state: nodeState,
          buildingId: buildingId,
          versionId: versionId
        }
      }),
    switchMap(({state, buildingId, versionId}) => {
        return this.nodeSetsService.getAllNodeSetsList(buildingId, versionId).pipe(
          map(r => new nodeSetsAction.RequestNodeListComplete(r)),
          catchError(() => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  //Delete node
  deleteNode: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeSetsAction.DELETE_NODE_SET),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          nodeId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        }
      }),
    switchMap(({nodeId, buildingId, versionId}) => {
      return this.nodeSetsService.deleteNodeSet(buildingId, nodeId, versionId).pipe(
        map(r => {
          return new commonDataActions.GetHistoryWithVersionId(r.id);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromNodeSets.State>,
    private nodeSetsService: NodeSetsService
  ) {
  }

  /*sendNodeRequest(action: any, model: NodeDetailViewModel, versionId: string, isDocumentComplete: boolean) {

      let actionType = isDocumentComplete ? action.actionType : VersionActionType.Init;
      let version: VersionViewModel<NodeDetailViewModel> = new VersionViewModel(model, action.comment,
          actionType, action.date, versionId);

      return this.nodeSetsService.updateNode(model.buildingId, {}).pipe(
          map(r => {
              return { status: true, payload: r, nodeId: model.id };
          }),
          catchError(() => {
              return of({ status: false, payload: null, nodeId: model.id });
          })
      );
  }*/
}

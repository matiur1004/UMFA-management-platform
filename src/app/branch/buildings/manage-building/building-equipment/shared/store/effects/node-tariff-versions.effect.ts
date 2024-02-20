import {NodeTariffVersionsAction} from './../../../../shared/enums/node-tariff-versions-action.enum';
import {createUrlPartFromDate} from '@shared-helpers';
import {BuildingTariffState} from '../../../../shared/enums/building-tariff-state.enum';
import {BranchManagerService, BuildingService} from '@services';
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import * as nodeApplyNewTariffVersionsAction from '../actions/node-apply-new-tariff-versions.action';
import * as fromEquipment from '../reducers';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NodeTariffsPopup} from "@app/branch/buildings/manage-building/shared/components/node-tariffs-popup/node-tariffs-popup.component";
import {Router} from "@angular/router";
import {
  NodeTariffsPopupMode,
  NodeTariffsPopupResult
} from "@app/branch/buildings/manage-building/shared/enums/node-tariffs-popup.enum";
import {NodeTariffsAppliedPopup} from "@app/branch/buildings/manage-building/shared/components/node-tariffs-applied-popup/node-tariffs-applied-popup.component";
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import {of} from "rxjs";
import {NodeTariffVersionsProcessingScope} from "@app/branch/buildings/manage-building/shared/enums/node-tariff-versions-processing-scope.enum";
import {BuildingPeriodsService} from '@app/branch/buildings/manage-building/shared/services/building-periods.service';

@Injectable()
export class NodeTariffVersionsEffects {

  processTariffStateOnBuildingLoad = createEffect(() => this.actions$.pipe(
    ofType(nodeApplyNewTariffVersionsAction.PROCESS_TARIFF_STATE_ON_BUILDING_LOAD),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (_, buildingId) => {
        return {
          buildingId: buildingId
        };
      }),
    switchMap(({buildingId}) => {
      return this.buildingPeriodService.getActiveBuildingPeriod(buildingId).pipe(
        map(buildingPeriod => {
          let buildingPeriodId = buildingPeriod.id
          return ({buildingId, buildingPeriodId})
        }))
    }),
    switchMap(({buildingId, buildingPeriodId}) => {
      return this.buildingService.getTariffState(buildingId, buildingPeriodId).pipe(
        map(tariffState => {
          const isInPendingTariffState = tariffState === BuildingTariffState.Pending || tariffState === BuildingTariffState.PendingWithReport

          if (isInPendingTariffState) {
            const popupMode = tariffState === BuildingTariffState.PendingWithReport
              ? NodeTariffsPopupMode.NewTariffVersionsWithChoice
              : NodeTariffsPopupMode.NewTariffVersionsInfo;

            return new nodeApplyNewTariffVersionsAction.ShowNewNodeTariffVersionsPopup({
              mode: popupMode,
              scope: NodeTariffVersionsProcessingScope.Building
            });
          } else {
            return {type: 'DUMMY'};
          }
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  showNewNodeTariffVersionsPopup = createEffect(() => this.actions$.pipe(
    ofType(nodeApplyNewTariffVersionsAction.SHOW_NEW_NODE_TARIFF_VERSIONS_POPUP),
    tap((action: { payload: { mode, scope } }) => {
      const modalRef = this.modalService.open(NodeTariffsPopup, {backdrop: 'static'});
      modalRef.componentInstance.mode = NodeTariffsPopupMode.NewTariffVersionsWithChoice
      modalRef.componentInstance.mode = action.payload.mode
      modalRef.result.then(popupResult => {
        const nodeTariffVersionsAction = this.getNodeTariffVersionsAction(popupResult, action.payload.scope);

        this.store$.dispatch(new nodeApplyNewTariffVersionsAction.ProcessNodeTariffVersions({action: nodeTariffVersionsAction}));
      }, () => { /* do nothing on close */
      });
    })
  ),{dispatch: false});
  showNodeTariffConflictsPopup = createEffect(() => this.actions$.pipe(
    ofType(nodeApplyNewTariffVersionsAction.SHOW_NODE_TARIFF_CONFLICTS_POPUP),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.branchManagerService.getBranchObservable(),
      (action: nodeApplyNewTariffVersionsAction.ShowNodeTariffConflictsPopup, buildingId, branch) => {
        return {
          nodeSets: action.payload.nodeSets,
          buildingId: buildingId,
          branchId: branch.id,
          versionDate: new Date(action.payload.versionDate)
        };
      }),
    tap(({nodeSets, buildingId, branchId, versionDate}) => {
      const modalRef = this.modalService.open(NodeTariffsPopup, {backdrop: 'static'});
      modalRef.componentInstance.mode = NodeTariffsPopupMode.Conflicts;
      modalRef.componentInstance.nodeSetsWithConflicts = nodeSets;
      modalRef.result.then(popupResult => {
        if (popupResult === NodeTariffsPopupResult.ResolveConflicts) {
          const versionDateString = createUrlPartFromDate(versionDate)
          const url = `/branch/${branchId}/buildings/${buildingId}/version/${versionDateString}/equipment/nodes/set/${nodeSets[0].id}`

          this.router.navigateByUrl(url, {replaceUrl: true});
        }
      }, () => { /* do nothing on close */
      });
    })
  ), {dispatch: false});
  showNodeTariffsAppliedPopup = createEffect(() =>this.actions$.pipe(
    ofType(nodeApplyNewTariffVersionsAction.SHOW_NODE_TARIFFS_APPLIED_POPUP),
    tap(() => {
      this.modalService.open(NodeTariffsAppliedPopup, {backdrop: 'static'});
    })
  ), {dispatch: false})
  processNodeTariffVersions = createEffect(() => this.actions$.pipe(
    ofType(nodeApplyNewTariffVersionsAction.PROCESS_NODE_TARIFF_VERSIONS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.branchManagerService.getBranchObservable(),
      (action: { payload: { action } }, buildingId, bracnh) => {
        return {
          action: action.payload.action,
          buildingId: buildingId,
          branchId: bracnh.id
        };
      }),
    switchMap(({buildingId, action, branchId}) => {
      return this.buildingService.processNewNodeTariffVersions(buildingId, action).pipe(map(versionResultViewModel =>
        ({versionResultViewModel, action, buildingId, branchId})
      ));
    }),
    switchMap(({versionResultViewModel, action, buildingId, branchId}) => {
      const versionDate = versionResultViewModel.current.versionDate;
      const nodeSetsWithConflicts = versionResultViewModel.entity;

      const hasConflicts = nodeSetsWithConflicts.length;
      const isApplyAction = action === NodeTariffVersionsAction.ApplyNewForBuilding ||
        action === NodeTariffVersionsAction.ApplyNewForReport;
      const isReportAction = action === NodeTariffVersionsAction.ApplyNewForReport || action === NodeTariffVersionsAction.KeepExistingForReport;
      const reportUrl = `/branch/${branchId}/buildings/${buildingId}/reports`;

      if (isApplyAction) {
        const modalRef = this.modalService.open(NodeTariffsAppliedPopup, {backdrop: 'static'});
        modalRef.result.finally(() => {
          if (hasConflicts) {
            this.store$.dispatch(new nodeApplyNewTariffVersionsAction.ShowNodeTariffConflictsPopup(
              {
                nodeSets: nodeSetsWithConflicts,
                versionDate: versionDate
              }));
          } else if (isReportAction) {
            this.router.navigateByUrl(reportUrl, {replaceUrl: true});
          }
        });

        return [
          new commonDataActions.UpdateUrlVersionAction(versionDate),
          new commonDataActions.GetHistoryWithVersionId(versionResultViewModel.current.id),
        ];
      } else {
        if (isReportAction) {
          if (hasConflicts) {
            return [new nodeApplyNewTariffVersionsAction.ShowNodeTariffConflictsPopup({
              nodeSets: nodeSetsWithConflicts,
              versionDate: versionDate
            })];
          } else {
            this.router.navigateByUrl(reportUrl, {replaceUrl: true});
          }
        }

        return of({type: 'DUMMY'});
      }
    })
  ), {dispatch: false})

  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private modalService: NgbModal,
    private buildingService: BuildingService,
    private branchManagerService: BranchManagerService,
    private buildingPeriodService: BuildingPeriodsService
  ) {
  }

  getNodeTariffVersionsAction(popupResult: NodeTariffsPopupResult, scope: NodeTariffVersionsProcessingScope): NodeTariffVersionsAction {
    switch (popupResult) {
      case NodeTariffsPopupResult.KeepExistingTariffVersions:
        switch (scope) {
          case NodeTariffVersionsProcessingScope.Building:
            return NodeTariffVersionsAction.KeepExistingForBuilding;
          default:
            return NodeTariffVersionsAction.KeepExistingForReport;
        }

      default:
        switch (scope) {
          case NodeTariffVersionsProcessingScope.Building:
            return NodeTariffVersionsAction.ApplyNewForBuilding;
          default:
            return NodeTariffVersionsAction.ApplyNewForReport;
        }
    }
  }
}

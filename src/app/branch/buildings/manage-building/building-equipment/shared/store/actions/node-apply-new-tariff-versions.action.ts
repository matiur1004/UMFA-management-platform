import {NodeTariffVersionsAction} from './../../../../shared/enums/node-tariff-versions-action.enum';
import {NodeTariffsPopupMode} from './../../../../shared/enums/node-tariffs-popup.enum';
import {NodeSetsViewModel} from './../../models/node.model';
import {Action as StoreAction} from '@ngrx/store';
import {NodeTariffVersionsProcessingScope} from "@app/branch/buildings/manage-building/shared/enums/node-tariff-versions-processing-scope.enum";

export const PROCESS_TARIFF_STATE_ON_BUILDING_LOAD = '[Node] PROCESS_TARIFF_STATE_ON_BUILDING_LOAD';
export const SHOW_NEW_NODE_TARIFF_VERSIONS_POPUP = '[Node] SHOW_NEW_NODE_TARIFF_VERSIONS_POPUP'
export const SHOW_NODE_TARIFF_CONFLICTS_POPUP = '[Node] SHOW_NODE_TARIFF_CONFLICTS_POPUP'
export const SHOW_NODE_TARIFFS_APPLIED_POPUP = '[Node] SHOW_NODE_TARIFFS_APPLIED_POPUP'
export const PROCESS_NODE_TARIFF_VERSIONS = '[Node] PROCESS_NODE_TARIFF_VERSIONS';

export class ProcessTariffStateOnBuildingLoad implements StoreAction {
  readonly type = PROCESS_TARIFF_STATE_ON_BUILDING_LOAD;

  constructor() {
  }
}

export class ShowNewNodeTariffVersionsPopup implements StoreAction {
  readonly type = SHOW_NEW_NODE_TARIFF_VERSIONS_POPUP;

  constructor(public payload: { mode: NodeTariffsPopupMode, scope: NodeTariffVersionsProcessingScope }) {
  }
}

export class ShowNodeTariffConflictsPopup implements StoreAction {
  readonly type = SHOW_NODE_TARIFF_CONFLICTS_POPUP;

  constructor(public payload: { nodeSets: NodeSetsViewModel[], versionDate: Date | string }) {
  }
}

export class ShowNodeTariffsAppliedPopup implements StoreAction {
  readonly type = SHOW_NODE_TARIFFS_APPLIED_POPUP;

  constructor() {
  }
}

export class ProcessNodeTariffVersions implements StoreAction {
  readonly type = PROCESS_NODE_TARIFF_VERSIONS;

  constructor(public payload: { action: NodeTariffVersionsAction }) {
  }
}

export type Action =
  ProcessTariffStateOnBuildingLoad |
  ShowNewNodeTariffVersionsPopup |
  ShowNodeTariffConflictsPopup |
  ShowNodeTariffsAppliedPopup |
  ProcessNodeTariffVersions;

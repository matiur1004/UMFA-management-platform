import {Action as StoreAction} from '@ngrx/store';
import {CostProviderNodeModel} from '@models';

export const REQUEST_COST_PROVIDER_NODES = '[Building Tariff] REQUEST_COST_PROVIDER_NODES';

export class RequestCostProviderNodes implements StoreAction {
  readonly type = REQUEST_COST_PROVIDER_NODES;

  constructor() {
  }
}

export const REQUEST_COST_PROVIDER_NODES_COMPLETE = '[Building Tariff] REQUEST_COST_PROVIDER_NODES_COMPLETE';

export class RequestCostProviderNodesComplete implements StoreAction {
  readonly type = REQUEST_COST_PROVIDER_NODES_COMPLETE;

  constructor(public payload: CostProviderNodeModel[]) {
  }
}

export type Action = RequestCostProviderNodes | RequestCostProviderNodesComplete;

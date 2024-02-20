import * as costProviderNodesActions from '../actions/cost-provider-nodes.actions';
import {CostProviderNodeModel} from '@models';


export interface State {
  nodes: CostProviderNodeModel[];
}

export const initialState: State = {
  nodes: []
};

export const reducer = (state = initialState, action: costProviderNodesActions.Action) => {

  switch (action.type) {
    case costProviderNodesActions.REQUEST_COST_PROVIDER_NODES_COMPLETE: {
      return {
        ...state,
        nodes: action.payload
      };
    }

    default:
      return state;
  }
};

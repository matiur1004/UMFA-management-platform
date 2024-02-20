import {NodeSetsViewModel} from '../../models';

import * as nodeActions from '../actions/node-sets.actions';

export interface State {
  sets: NodeSetsViewModel[];
  /*searchKey: string;
  total: number;
  order: number;
  page: number;
  unitsPerPage: number | null;
  supplyTypeFilter: number;
  nodeTypeFilter: number;*/
}

export const initialState: State = {
  sets: [],
  /*searchKey: '',
  total: 0,
  order: 1,
  page: 1,
  unitsPerPage: 30,
  supplyTypeFilter: -1,
  nodeTypeFilter: -1*/
}

export function reducer(state = initialState, action: nodeActions.Action) {
  switch (action.type) {

    case nodeActions.REQUEST_NODE_SETS_LIST: {
      return {
        ...state,
        nodes: [],
        total: 0,
        page: 1
      };
    }

    case nodeActions.REQUEST_NODE_SET_LIST_COMPLETE: {
      return {
        ...state,
        nodes: action.payload.items,
        total: action.payload.total,
        page: 1
      };
    }


    default:
      return state;
  }
}

export const getNodeSets = (state: State) => state.sets;

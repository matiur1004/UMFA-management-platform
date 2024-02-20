import * as fromActions from '../actions/equipment-tree.actions';

export interface State {
  tree: any;
}

export const initialState: State = {
  tree: null,
};

export function reducer(state = initialState, action: fromActions.Action) {
  switch (action.type) {

    case fromActions.GET_EQUIPMENT_TREE_SUCCESS:
      return {
        ...state,
        tree: action.payload
      };

    default:
      return state;
  }
}

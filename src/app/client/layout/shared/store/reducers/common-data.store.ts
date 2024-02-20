import * as commonDataActions from '../actions/common-data.actions';

export interface State {
  clientId: string;
}

export const initialState: State = {
  clientId: ''
};

export function reducer(state = initialState, action: commonDataActions.Action) {
  switch (action.type) {
    case commonDataActions.GET_CLIENT_ID_REQUEST_COMPLETE: {
      return {
        ...state,
        clientId: action.payload
      };
    }

    default:
      return state;
  }
}

export const getClientId = (state: State) => state.clientId;

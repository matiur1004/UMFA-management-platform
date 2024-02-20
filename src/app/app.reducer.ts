import {createAction, INIT, MetaReducer} from '@ngrx/store';

export const logoutAction = createAction(
  '[STORE] logout request'
);

export function logout(reducer) {
  return (state, action) => {
    if (action != null && action.type === logoutAction.type) {
      return reducer(undefined, {type: INIT});
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer[] = [logout];

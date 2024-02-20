import * as actions from '../actions/supplier-common.actions';
import {RegisterViewModel} from '@models';

export const reducer = (state: RegisterViewModel[] = null, a: actions.Action): RegisterViewModel[] => {
  switch (a.type) {
    case actions.API_SUPPLIER_GET_REGISTERS_SUCCESS:
      return a.payload;
    default:
      return state;
  }
};

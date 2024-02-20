import * as bldTariffsActions from '../actions/building-tariffs.actions';
import {RegisterViewModel} from '@models';

export const reducer = (state: RegisterViewModel[] = null, a: bldTariffsActions.Action): RegisterViewModel[] => {
  switch (a.type) {
    case bldTariffsActions.API_EQUIPMENT_GET_REGISTERS_SUCCESS:
      return a.payload;
    default:
      return state;
  }
};

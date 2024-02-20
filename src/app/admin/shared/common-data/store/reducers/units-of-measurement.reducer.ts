import * as actions from '../actions/common.actions';
import {UnitOfMeasurement} from '@models';

export const reducer = (state: UnitOfMeasurement[] = null, a: actions.Action): UnitOfMeasurement[] => {
  switch (a.type) {
    case actions.SET_UNIT_OF_MEASUREMENT:
      return a.payload;
    default:
      return state;
  }
};

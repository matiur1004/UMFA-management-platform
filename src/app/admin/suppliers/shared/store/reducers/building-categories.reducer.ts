import * as actions from '../actions/tariff.actions';
import {CategoryViewModel} from '@models';

export const reducer = (state: CategoryViewModel[] = null, a: actions.Action): CategoryViewModel[] => {
  switch (a.type) {
    case actions.GET_BUILDING_CATEGORIES_COMPLETE:
      return a.payload;
    default:
      return state;
  }
};

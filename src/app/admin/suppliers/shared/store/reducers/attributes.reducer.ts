import * as actions from '../actions/supplier-common.actions';
import {EquipmentAttributeViewModel} from '@models';

export const reducer = (state: EquipmentAttributeViewModel[] = null, a: actions.Action): EquipmentAttributeViewModel[] => {
  switch (a.type) {
    case actions.API_SUPPLIER_GET_ATTRIBUTES_SUCCEEDED:
      return a.payload;
    default:
      return state;
  }
};

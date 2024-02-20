import * as bldTariffsActions from '../actions/building-tariffs.actions';
import {EquipmentAttributeViewModel} from '@models';

export const reducer = (state: EquipmentAttributeViewModel[] = null, a: bldTariffsActions.Action): EquipmentAttributeViewModel[] => {
  switch (a.type) {
    case bldTariffsActions.API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED:
      return a.payload;
    default:
      return state;
  }
};

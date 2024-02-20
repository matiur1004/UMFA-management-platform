import * as allocatedEquipmentActions from '../../actions/shop-detail-actions/allocated-equipment.actions';
import {ShopMeterViewModel} from '../../../profiles/models/shop-detail.model';


export interface State {
  allocatedEquipment: ShopMeterViewModel[];
}

export const initialState: State = {
  allocatedEquipment: []
};

export function reducer(state = initialState, action: allocatedEquipmentActions.Actions) {
  switch (action.type) {
    case allocatedEquipmentActions.GET_ALLOCATED_EQUIP_REQUEST_COMPLETE: {
      return {
        ...state,
        allocatedEquipment: action.payload
      };
    }

    default:
      return state;
  }
}

export const getAllocatedEquipment = (state: State) => state.allocatedEquipment;

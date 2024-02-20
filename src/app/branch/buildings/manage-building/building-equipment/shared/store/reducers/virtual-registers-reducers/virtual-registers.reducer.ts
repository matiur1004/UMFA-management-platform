import {initialState} from '@app/branch/buildings/manage-building/building-equipment/shared/store/state/virtual-registers.state';
import * as virtualRegistersActions from '../../actions/virtual-registers.action';


export function reducer(state = initialState, action: virtualRegistersActions.Action) {

  switch (action.type) {

    case virtualRegistersActions.REQUEST_VIRTUAL_REGISTERS_COMPLETE: {
      return {
        ...state,
        registers: action.payload.items,
        total: action.payload.total
      };
    }

    case virtualRegistersActions.SET_VIRTUAL_REGISTER_DETAIL_SUCCESS: {
      return {
        ...state,
        selectedRegister: action.payload
      };
    }

    case virtualRegistersActions.CREATE_VIRTUAL_REGISTER_COMPLETE: {

      const selectedRegister = {...state.selectedRegister, id: action.payload};

      return {
        ...state,
        selectedRegister
      };
    }

    default:
      return state;
  }
}

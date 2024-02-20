import * as fromActions from '../actions';

export interface State {
  floors: any[];
  activeFloor: any;
  activeFloorSequenceNumber: number;
  shops: any[];
  plan: string;
}

export const initialState: State = {
  floors: [],
  activeFloor: null,
  activeFloorSequenceNumber: 0,
  shops: [],
  plan: null
};

export function reducer(state = initialState, action: fromActions.Actions) {
  switch (action.type) {

    case fromActions.GET_BUILDING_FLOORS_SUCCESS:
      return {
        ...state,
        floors: action.payload
      };

    case fromActions.SET_ACTIVE_PLAN_FLOOR:
      let floorIndex = state.floors.indexOf(state.floors.find(f => f.id === action.payload));
      if (floorIndex < 0) {
        floorIndex = state.activeFloorSequenceNumber;
      }
      return {
        ...state,
        activeFloor: action.payload,
        activeFloorSequenceNumber: floorIndex
      };

    case fromActions.GET_BUILDING_SHOPS_SUCCESS:
      return {
        ...state,
        shops: action.payload
      };

    case fromActions.GET_FLOOR_PLAN_SUCCESS:
      return {
        ...state,
        plan: action.payload
      };

    case fromActions.SAVE_FLOOR_PLAN_SUCCESS:
      return {
        ...state,
        floors: state.floors.map(
          (floor) => floor.id === state.activeFloor
            ? {...floor, schema: action.payload}
            : floor
        ),
        plan: action.payload
      };

    case fromActions.RESET_FLOOR_PLAN:
      return {
        ...state,
        floors: state.floors.map(
          (floor) => floor.id === state.activeFloor
            ? {...floor, schema: ''}
            : floor
        ),
        plan: ''
      };

    default:
      return state;
  }
}

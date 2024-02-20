import * as buildingStepWizardAction from '../actions/building-step-wizard.actions';
import {LocationViewModel} from '@models';

export interface State {
  locations: LocationViewModel[];
  locationOrderIndex: number;
}

export const initialState: State = {
  locations: [],
  locationOrderIndex: 1
};

export function reducer(state = initialState, action: buildingStepWizardAction.Action) {

  switch (action.type) {
    case buildingStepWizardAction.ADD_LOCATION: {
      const locations = [...state.locations, {
        id: null,
        name: action.payload.name,
        description: action.payload.description,
        sequenceNumber: state.locations.length + 1
      }];

      return {
        ...state,
        locations: locations
      };
    }

    case buildingStepWizardAction.UPDATE_LOCATION: {
      let updated = false;
      const locations = state.locations.map(l => {
        if (l.sequenceNumber === action.payload.sequenceNumber) {
          updated = true;
          return {
            ...l,
            name: action.payload.name,
            description: action.payload.description
          };
        }
        return l;
      });
      return updated ? {...state, locations: locations} : state;
    }


    case buildingStepWizardAction.DELETE_LOCATION: {
      const locations = state.locations.filter(location => location.sequenceNumber !== action.payload);
      return {
        ...state,
        locations: locations.map((location, index) => ({
          ...location,
          sequenceNumber: index + 1
        })),
      };
    }

    case buildingStepWizardAction.UPDATE_LOCATION_SEQUENCE_NUMBER: {
      const {currentIndex, previousIndex} = action.payload;
      const draggedFromBottom = previousIndex > currentIndex;
      const draggedFromTop = previousIndex < currentIndex;
      const updateSequenceNumber = (location, coef: number) => ({
        ...location,
        sequenceNumber: location.sequenceNumber + 1 * coef
      });

      return {
        ...state,
        locations: state.locations.map((location, index) => {
          if (index === previousIndex) {
            return {
              ...location,
              sequenceNumber: currentIndex + 1
            };
          }
          if (draggedFromBottom) {
            const isUpdatingLocation = index >= currentIndex && index <= previousIndex;
            return isUpdatingLocation ? updateSequenceNumber(location, 1) : location;
          }
          if (draggedFromTop) {
            const isUpdatingLocation = index <= currentIndex && index >= previousIndex;
            return isUpdatingLocation ? updateSequenceNumber(location, -1) : location;
          }

          return location;
        }),
      };
    }

    case buildingStepWizardAction.UPDATE_LOCATION_ORDER: {
      return {
        ...state,
        locationOrderIndex: action.payload
      };
    }

    case buildingStepWizardAction.SET_LOCATIONS_LIST: {
      return {
        ...state,
        locations: action.payload
      };
    }

    default:
      return state;
  }

}

export const getLocations = (state: State) => state.locations;

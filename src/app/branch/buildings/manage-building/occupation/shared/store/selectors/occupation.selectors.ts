import {createSelector} from '@ngrx/store';
import {getBuildingStepWizardState} from '../reducers';
import {LocationOrder} from '../../models';
import {LocationViewModel} from '@models';

const getLocations = createSelector(
  getBuildingStepWizardState,
  state => state.locations
);

export const getLocationOrderIndex = createSelector(
  getBuildingStepWizardState,
  (state) => state.locationOrderIndex
);

export const getSortedLocations = createSelector(
  getLocations,
  getLocationOrderIndex,
  (locations, locationOrderIndex) => {
    return sortLocation(locationOrderIndex, locations);
  }
);

export const getLocationsCount = createSelector(
  getLocations,
  (items) => {
    return items.length;
  }
);

const sortLocation = (order, locations: LocationViewModel[]) => {

  switch (order) {
    case LocationOrder.LocationSequenceAsc:
      return locations.sort((a, b) => sortRule(a.sequenceNumber, b.sequenceNumber));
    case LocationOrder.LocationSequenceDesc:
      return locations.sort((a, b) => sortRule(b.sequenceNumber, a.sequenceNumber));
    case LocationOrder.LocationNameAsc:
      return locations.sort((a, b) => sortRule(a.name, b.name));
    case LocationOrder.LocationNameDesc:
      return locations.sort((a, b) => sortRule(b.name, a.name));
  }
};

const sortRule = (a, b) => {
  return (a > b) ? 1 : (a < b) ? -1 : 0;
};

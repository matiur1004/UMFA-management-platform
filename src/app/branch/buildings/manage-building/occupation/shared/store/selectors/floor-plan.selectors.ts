import {createSelector} from '@ngrx/store';
import {getFloorPlansState} from '../reducers';

export const selectFloorPlansFloors = createSelector(getFloorPlansState, (state) => state.floors);
export const selectFloorPlansActiveFloor = createSelector(getFloorPlansState, (state) => state.activeFloor);
export const selectFloorPlansActiveFloorSequenceNumber = createSelector(getFloorPlansState, (state) => state.activeFloorSequenceNumber);

export const selectFloorPlansShops = createSelector(
  getFloorPlansState,
  (state) => state.shops
);

export const selectFloorPlansPlan = createSelector(
  selectFloorPlansActiveFloor,
  selectFloorPlansFloors,
  (floorId: string, floors: any[]) => {
    if (!floorId)
      return null;

    let floor = floors.find(f => f.id === floorId);

    if (floor != null)
      return floor.schema;
    return null;
  }
);

export const selectFloorPlansFloorShops = createSelector(
  selectFloorPlansActiveFloor,
  selectFloorPlansFloors,
  (floorId: any, floors: any[]) => {
    if (!floorId)
      return [];

    var floor = floors.find(f => f.id === floorId);
    return floor ? floor.shops : [];
  }
);

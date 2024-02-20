import {Action as StoreAction} from '@ngrx/store';

export const GET_FLOOR_PLAN = '[Floor Plans] GET_FLOOR_PLAN';
export const GET_FLOOR_PLAN_SUCCESS = '[Floor Plans] GET_FLOOR_PLAN_SUCCESS';

export class GetFloorPlan implements StoreAction {
  readonly type = GET_FLOOR_PLAN;

  constructor(public payload: { buildingId: string, floorId: string }) {
  }
}

export class GetFloorPlanSuccess implements StoreAction {
  readonly type = GET_FLOOR_PLAN_SUCCESS;

  constructor(public payload: any) {
  }
}

export const GET_BUILDING_SHOPS = '[Floor Plans] GET_BUILDING_SHOPS';
export const GET_BUILDING_SHOPS_SUCCESS = '[Floor Plans] GET_BUILDING_SHOPS_SUCCESS';

export class GetBuildingShops implements StoreAction {
  readonly type = GET_BUILDING_SHOPS;

  constructor() {
  }
}

export class GetBuildingShopsSuccess implements StoreAction {
  readonly type = GET_BUILDING_SHOPS_SUCCESS;

  constructor(public payload: any) {
  }
}

export const GET_BUILDING_FLOORS = '[Floor Plans] GET_BUILDING_FLOORS';
export const GET_BUILDING_FLOORS_SUCCESS = '[Floor Plans] GET_BUILDING_FLOORS_SUCCESS';

export class GetBuildingFloors implements StoreAction {
  readonly type = GET_BUILDING_FLOORS;

  constructor() {
  }
}

export class GetBuildingFloorsSuccess implements StoreAction {
  readonly type = GET_BUILDING_FLOORS_SUCCESS;

  constructor(public payload: any) {
  }
}

export const SET_ACTIVE_PLAN_FLOOR = '[Floor Plans] SET_ACTIVE_PLAN_FLOOR';

export class SetActivePlanFloor implements StoreAction {
  readonly type = SET_ACTIVE_PLAN_FLOOR;

  constructor(public payload: any) {
  }
}

export const SAVE_FLOOR_PLAN = '[Floor Plans] SAVE_FLOOR_PLAN';
export const SAVE_FLOOR_PLAN_SUCCESS = '[Floor Plans] SAVE_FLOOR_PLAN_SUCCESS';

export class SaveFloorPlan implements StoreAction {
  readonly type = SAVE_FLOOR_PLAN;

  constructor(public payload: any) {
  }
}

export class SaveFloorPlanSuccess implements StoreAction {
  readonly type = SAVE_FLOOR_PLAN_SUCCESS;

  constructor(public payload: any) {
  }
}

export const RESET_FLOOR_PLAN = '[Floor Plans] RESET_FLOOR_PLAN';

export class ResetFloorPlan implements StoreAction {
  readonly type = RESET_FLOOR_PLAN;

  constructor() {
  }
}

export type FloorPlansActions =
  GetFloorPlan
  | GetFloorPlanSuccess
  | GetBuildingShops
  | GetBuildingShopsSuccess
  | GetBuildingFloors
  | GetBuildingFloorsSuccess
  | SetActivePlanFloor
  | SaveFloorPlan
  | SaveFloorPlanSuccess
  | ResetFloorPlan;

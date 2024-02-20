import {Action as StoreAction} from '@ngrx/store';

export const GET_EQUIPMENT_TREE = '[Building Equipment Tree] GET_EQUIPMENT_TREE';
export const GET_EQUIPMENT_TREE_SUCCESS = '[Building Equipment Tree] GET_EQUIPMENT_TREE_SUCCESS';

export class GetEquipmentTree implements StoreAction {
  readonly type = GET_EQUIPMENT_TREE;
}

export class GetEquipmentTreeSuccess implements StoreAction {
  readonly type = GET_EQUIPMENT_TREE_SUCCESS;

  constructor(public payload: any) {
  }
}

export type Action = GetEquipmentTree | GetEquipmentTreeSuccess;

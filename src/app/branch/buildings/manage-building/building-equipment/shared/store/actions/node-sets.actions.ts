import {Action as StoreAction} from '@ngrx/store';

export const REQUEST_NODE_SETS_LIST = '[Building Equipment Node Sets] REQUEST_NODE_SETS_LIST';
export const REQUEST_NODE_SET_LIST_COMPLETE = '[Building Equipment Node Sets] REQUEST_NODE_SET_LIST_COMPLETE';
export const UPDATE_NODE_SET = '[Building Equipment Node Sets] UPDATE_NODE_SET';
export const DELETE_NODE_SET = '[Building Equipment Node Sets] DELETE_NODE_SET';


export class RequestNodeSetsList implements StoreAction {
  readonly type = REQUEST_NODE_SETS_LIST;

  constructor() {
  }
}

export class RequestNodeListComplete implements StoreAction {
  readonly type = REQUEST_NODE_SET_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateNode implements StoreAction {
  readonly type = UPDATE_NODE_SET;

  constructor(public payload: any) {
  }
}

export class DeleteNode implements StoreAction {
  readonly type = DELETE_NODE_SET;

  constructor(public payload: any) {
  }
}

export type Action = RequestNodeSetsList | RequestNodeListComplete | UpdateNode | DeleteNode;

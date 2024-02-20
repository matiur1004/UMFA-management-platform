import {
  VirtualRegisterDetail,
  VirtualRegisterListItem
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {PagingViewModel, VersionViewModel} from '@models';
import {Action as StoreAction} from '@ngrx/store';

export const REQUEST_VIRTUAL_REGISTERS = '[Building Virtual Register] REQUEST_VIRTUAL_REGISTERS';
export const REQUEST_VIRTUAL_REGISTERS_COMPLETE = '[Building Virtual Register] REQUEST_VIRTUAL_REGISTERS_COMPLETE';

export const CREATE_VIRTUAL_REGISTER = '[Building Virtual Register] CREATE_VIRTUAL_REGISTER';
export const CREATE_VIRTUAL_REGISTER_COMPLETE = '[Building Virtual Register] CREATE_VIRTUAL_REGISTER_COMPLETE';
export const UPDATE_VIRTUAL_REGISTER = '[Building Virtual Register] UPDATE_VIRTUAL_REGISTER';
export const CLOSE_UPDATE_VIRTUAL_REGISTER = '[Building Virtual Register] CLOSE_UPDATE_VIRTUAL_REGISTER';

export const SEARCH_VIRTUAL_REGISTERS = '[Building Virtual Register] SEARCH_VIRTUAL_REGISTERS';

export const GET_VIRTUAL_REGISTER_DETAIL = '[Building Virtual Register] GET_VIRTUAL_REGISTER_DETAIL';

export const SET_VIRTUAL_REGISTER_DETAIL_SUCCESS = '[Building Virtual Register] SET_VIRTUAL_REGISTER_DETAIL_SUCCESS';

export const GET_VIRTUAL_REGISTER_DETAIL_FAILED = '[Building Virtual Register] GET_VIRTUAL_REGISTER_DETAIL_FAILED';

export const NAVIGATE_TO_VIRTUAL_REGISTER_DETAIL = '[Building Virtual Register] NAVIGATE_TO_VIRTUAL_REGISTER_DETAIL';

export const DELETE_VIRTUAL_REGISTER = '[Building Virtual Register] DELETE_VIRTUAL_REGISTER';

export class RequestVirtualRegisters implements StoreAction {
  readonly type = REQUEST_VIRTUAL_REGISTERS;

  constructor(public payload: PagingOptions<{ searchKey: string, versionId: string }> = {
    skip: 0,
    take: 0,
    requestParameters: {searchKey: '', versionId: ''}
  }) {
  }
}

export class RequestVirtualRegistersComplete implements StoreAction {
  readonly type = REQUEST_VIRTUAL_REGISTERS_COMPLETE;

  constructor(public payload: PagingViewModel<VirtualRegisterListItem>) {
  }
}

export class CreateVirtualRegister implements StoreAction {
  readonly type = CREATE_VIRTUAL_REGISTER;

  constructor(public payload: VersionViewModel<VirtualRegisterDetail>) {
  }
}

export class CreateVirtualRegisterComplete implements StoreAction {
  readonly type = CREATE_VIRTUAL_REGISTER_COMPLETE;

  constructor(public payload: string) {
  }
}

export class UpdateVirtualRegister implements StoreAction {
  readonly type = UPDATE_VIRTUAL_REGISTER;

  constructor(public payload: VersionViewModel<VirtualRegisterDetail>) {
  }
}

export class CloseUpdateVirtualRegister implements StoreAction {
  readonly type = CLOSE_UPDATE_VIRTUAL_REGISTER;

  constructor() {
  }
}

export class SearchVirtualRegisters implements StoreAction {
  readonly type = SEARCH_VIRTUAL_REGISTERS;

  constructor(public payload: PagingOptions<{ searchKey: string }> = {
    skip: 0,
    take: 0,
    requestParameters: {searchKey: ''}
  }) {
  }
}

export class GetVirtualRegisterDetail implements StoreAction {
  readonly type = GET_VIRTUAL_REGISTER_DETAIL;

  constructor(public payload: { vrId: string, versionId: string }) {
  }
}

export class GetVirtualRegisterDetailFailed implements StoreAction {
  readonly type = GET_VIRTUAL_REGISTER_DETAIL_FAILED;

  constructor() {
  }
}

export class SetVirtualRegisterDetailSuccess implements StoreAction {
  readonly type = SET_VIRTUAL_REGISTER_DETAIL_SUCCESS;

  constructor(public payload: VirtualRegisterDetail | null) {
  }
}

export class NavigateToVirtualRegisterDetail implements StoreAction {
  readonly type = NAVIGATE_TO_VIRTUAL_REGISTER_DETAIL;

  constructor(public payload: string) {
  }
}

export class DeleteVirtualRegister implements StoreAction {
  readonly type = DELETE_VIRTUAL_REGISTER;

  constructor(public payload: VersionViewModel<string>) {
  }
}

export type Action =
  | CreateVirtualRegister
  | CreateVirtualRegisterComplete
  | UpdateVirtualRegister
  | CloseUpdateVirtualRegister
  | RequestVirtualRegisters
  | RequestVirtualRegistersComplete
  | DeleteVirtualRegister
  | GetVirtualRegisterDetail
  | SetVirtualRegisterDetailSuccess
  | GetVirtualRegisterDetailFailed;

import {Action as StoreAction} from '@ngrx/store';

export const GET_PACKAGES_REQUEST = '[Packages] GET_PACKAGES_REQUEST';
export const GET_PACKAGES_REQUEST_COMPLETE = '[Packages] GET_PACKAGES_REQUEST_COMPLETE';
export const DELETE_PACKAGE_REQUEST = '[Packages] DELETE_PACKAGE_REQUEST';
export const DELETE_PACKAGE_REQUEST_COMPLETE = '[Packages] DELETE_PACKAGE_REQUEST_COMPLETE';
export const UPDATE_PACKAGE_STATUS_REQUEST = '[Packages] UPDATE_PACKAGE_STATUS';
export const UPDATE_PACKAGE_STATUS_REQUEST_COMPLETE = '[Packages] UPDATE_PACKAGE_STATUS_REQUEST_COMPLETE';
export const UPDATE_PACKAGES_ORDER = '[Packages] UPDATE_PACKAGES_ORDER';
export const UPDATE_PACKAGES_CATEGORY = '[Packages] UPDATE_PACKAGES_CATEGORY';
export const UPDATE_PACKAGES_PAGE = '[Packages] UPDATE_PACKAGES_PAGE';
export const UPDATE_PACKAGE_CATEGORY_FILTER = '[Packages] UPDATE_PACKAGE_CATEGORY_FILTER';

export class GetPackagesRequest implements StoreAction {
  readonly type = GET_PACKAGES_REQUEST;

  constructor() {
  }
}

export class GetPackagesRequestComplete implements StoreAction {
  readonly type = GET_PACKAGES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class DeletePackageRequest implements StoreAction {
  readonly type = DELETE_PACKAGE_REQUEST;

  constructor(public payload: string) {
  }
}

export class DeletePackageRequestComplete implements StoreAction {
  readonly type = DELETE_PACKAGE_REQUEST_COMPLETE;

  constructor(public payload: string) {
  }
}

export class UpdatePackageStatusRequest implements StoreAction {
  readonly type = UPDATE_PACKAGE_STATUS_REQUEST;

  constructor(public payload: any) {
  }
}

export class UpdatePackageStatusRequestComplete implements StoreAction {
  readonly type = UPDATE_PACKAGE_STATUS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdatePackagesOrder implements StoreAction {
  readonly type = UPDATE_PACKAGES_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdatePackagesCategory implements StoreAction {
  readonly type = UPDATE_PACKAGES_CATEGORY;

  constructor(public payload: any) {
  }
}

export class UpdatePackagesPage implements StoreAction {
  readonly type = UPDATE_PACKAGES_PAGE;

  constructor(public payload: any) {
  }
}

export class UpdatePackageCategoryFilter implements StoreAction {
  readonly type = UPDATE_PACKAGE_CATEGORY_FILTER;

  constructor(public payload: any) {
  }
}

export type Action =
  GetPackagesRequest
  | GetPackagesRequestComplete
  | DeletePackageRequest
  | DeletePackageRequestComplete
  | UpdatePackageStatusRequest
  | UpdatePackageStatusRequestComplete
  | UpdatePackagesOrder
  | UpdatePackagesPage
  | UpdatePackageCategoryFilter
  | UpdatePackagesCategory;

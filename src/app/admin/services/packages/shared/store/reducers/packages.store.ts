import * as packagesAction from '../actions/packages.actions';

import {PackageCategory, PackageOrder, PackageViewModel} from '@models';

export interface State {
  packages: PackageViewModel[];
  packagesOrder: PackageOrder;
  packagesCategory: PackageCategory;
  page: number;
  totalItems: number;
  itemsPerPage: number | null;
}

export const initialState: State = {
  packages: [],
  packagesOrder: 1,
  packagesCategory: -1,
  page: 0,
  totalItems: 0,
  itemsPerPage: null
}

export function reducer(state = initialState, action: packagesAction.Action) {
  switch (action.type) {

    case packagesAction.GET_PACKAGES_REQUEST: {

      return {
        ...state,
        packagesOrder: 1,
        packagesCategory: -1,
        packages: [],
        totalItems: 0
      }
    }

    case packagesAction.GET_PACKAGES_REQUEST_COMPLETE: {

      return {
        ...state,
        packages: action.payload.items,
        totalItems: action.payload.total
      }
    }

    case packagesAction.UPDATE_PACKAGE_STATUS_REQUEST_COMPLETE: {
      const {payload} = action;
      const {packageId, value} = payload;

      let packages = state.packages.map(p => {

        if (p.id === packageId) {
          let result = Object.assign({}, p);
          result.isActive = value;
          return result;
        }

        return p;
      });

      return {
        ...state,
        packages: packages
      }
    }

    case packagesAction.UPDATE_PACKAGES_ORDER: {
      const {payload} = action;

      return {
        ...state,
        packagesOrder: payload
      }
    }

    case packagesAction.UPDATE_PACKAGES_CATEGORY: {
      const {payload} = action;

      return {
        ...state,
        packagesCategory: payload
      }
    }

    case packagesAction.UPDATE_PACKAGES_PAGE: {
      const {payload} = action;

      return {
        ...state,
        page: payload
      }
    }

    case packagesAction.DELETE_PACKAGE_REQUEST_COMPLETE: {
      return {
        ...state,
        packages: state.packages.filter(p => p.id !== action.payload)
      }
    }

    case packagesAction.UPDATE_PACKAGE_CATEGORY_FILTER: {
      const {payload} = action;

      return {
        ...state,
        packageCategoryFilter: payload
      }
    }

    default:
      return state;
  }

}

export const getPackages = (state: State) => state.packages;
export const getPackagesOrder = (state: State) => state.packagesOrder;
export const getPackagesCategory = (state: State) => state.packagesCategory;
export const getPage = (state: State) => state.page;
export const getTotalItems = (state: State) => state.totalItems;
export const getItemsPerPage = (state: State) => state.itemsPerPage;

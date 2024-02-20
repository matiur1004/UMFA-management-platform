import * as buildingServicesAction from '../actions/building-services.actions';

import {
  BuildingPackageDetailViewModel,
  BuildingPackageViewModel
} from "app/branch/buildings/building-services/shared/models";
import {InputEx} from '@shared-helpers';

export interface State {
  buildingId: string;
  packages: BuildingPackageViewModel[];
  packageDetails: BuildingPackageDetailViewModel;
  searchTerm: string;
  page: number;
  isShowPrice: boolean;
  serviceFilter: number;
  packagesTotal: number;
  pageSize: number;
  isCompleted: boolean;
  packageCategoryFilter: number;
}

export const initialState: State = {
  buildingId: null,
  packages: [],
  packageDetails: null,
  searchTerm: '',
  page: 1,
  isShowPrice: true,
  serviceFilter: -1,
  packagesTotal: 0,
  pageSize: 5,
  isCompleted: false,
  packageCategoryFilter: -1
};

export function reducer(state = initialState, action: buildingServicesAction.Action) {
  switch (action.type) {

    case buildingServicesAction.GET_PACKAGES_REQUEST: {

      return {
        ...state,
        packages: [],
        packageDetails: null,
        packagesTotal: 0
      };
    }

    case buildingServicesAction.GET_PACKAGES_REQUEST_COMPLETE: {

      return {
        ...state,
        packages: action.payload.items,
        packagesTotal: action.payload.total,
        packageDetails: null
      };
    }

    case buildingServicesAction.GET_PACKAGE_DETAILS_REQUEST_COMPLETE: {
      const {payload} = action;

      const packageDetails: BuildingPackageDetailViewModel = payload;
      packageDetails.hasElectricitySupplierDefault = payload.hasElectricitySupplier;
      packageDetails.hasWaterSupplierDefault = payload.hasWaterSupplier;
      packageDetails.hasSewerageSupplierDefault = payload.hasSewerageSupplier;
      packageDetails.hasGasSupplierDefault = payload.hasGasSupplier;
      packageDetails.hasAdHocSupplierDefault = payload.hasAdHocSupplier;

      return {
        ...state,
        packageDetails: packageDetails
      };
    }

    case buildingServicesAction.TOGGLE_DISPLAY_PRICE: {

      return {
        ...state,
        isShowPrice: !state.isShowPrice
      };
    }

    case buildingServicesAction.UPDATE_SERVICE_FILTER: {
      const {payload} = action;

      return {
        ...state,
        serviceFilter: payload
      };
    }

    case buildingServicesAction.TOGGLE_SERVICE_EXPAND: {
      const packageDetails = JSON.parse(JSON.stringify(state.packageDetails));
      const services = InputEx.updateService(action.payload, packageDetails.services, (service) => {
        const result = Object.assign({}, service);
        result.isExpanded = !service.isExpanded;

        return result;
      });

      packageDetails.services = services;

      return {
        ...state,
        packageDetails: packageDetails
      };
    }

    case buildingServicesAction.UPDATE_PACKAGES_PAGE: {
      const {payload} = action;


      return {
        ...state,
        page: payload
      };
    }

    case buildingServicesAction.UPDATE_PACKAGES_SEARCH_TERM: {
      const {payload} = action;

      return {
        ...state,
        searchTerm: payload
      };
    }

    case buildingServicesAction.UPDATE_SELECTED_PACKAGE_COMPLETE: {
      const {payload} = action;

      const packageDetails: BuildingPackageDetailViewModel = payload;
      packageDetails.hasElectricitySupplierDefault = payload.hasElectricitySupplier;
      packageDetails.hasWaterSupplierDefault = payload.hasWaterSupplier;
      packageDetails.hasSewerageSupplierDefault = payload.hasSewerageSupplier;
      packageDetails.hasGasSupplierDefault = payload.hasGasSupplier;
      packageDetails.hasAdHocSupplierDefault = payload.hasAdHocSupplier;

      return {
        ...state,
        packageDetails: packageDetails
      };
    }

    case buildingServicesAction.UPDATE_PACKAGE_SUPPLY_TYPES: {
      const {payload} = action;

      const packageDetails = JSON.parse(JSON.stringify(state.packageDetails));
      packageDetails[payload] = !packageDetails[payload];

      return {
        ...state,
        packageDetails: packageDetails
      };
    }

    case buildingServicesAction.UPDATE_PACKAGE_CHARGING_METHOD: {
      const {payload} = action;

      const packageDetails = JSON.parse(JSON.stringify(state.packageDetails));
      packageDetails.chargingMethod = payload;

      return {
        ...state,
        packageDetails: packageDetails
      };
    }

    case buildingServicesAction.UPDATE_BUILDING_ID: {
      return {
        ...state,
        buildingId: action.payload
      };
    }

    case buildingServicesAction.UPDATE_IS_COMPLETED: {
      return {
        ...state,
        isCompleted: action.payload
      };
    }

    case buildingServicesAction.GET_BUILDING_SERVICES_APPLIED: {
      return {
        ...state,
        packages: [],
        isCompleted: true,
        packageDetails: null
      };
    }

    case buildingServicesAction.UPDATE_PACKAGE_CATEGORY_FILTER: {
      const {payload} = action;

      return {
        ...state,
        page: 1,
        packageCategoryFilter: payload
      };
    }

    case buildingServicesAction.UPDATE_SERVICE_STATUS: {
      const {payload} = action;
      const {serviceId, value} = payload;

      let services: any = state.packageDetails.services;

      if (value) {
        // enable all parent
        let nextId = serviceId;
        while (nextId) {
          services = InputEx.updateService(nextId, services, (service) => {
            const result = Object.assign({}, service);
            result.isActive = value;
            nextId = service.parentId;
            return result;
          });
        }
      } else {
        // disable all children
        const serviceIds = new Array<string>();
        serviceIds.push(serviceId);

        do {
          const nextId = serviceIds.pop();
          services = InputEx.updateService(nextId, services, (service) => {
            const result = Object.assign({}, service);
            result.isActive = value;
            result.services.forEach(subService => {
              serviceIds.push(subService.id);
            });
            return result;
          });
        } while (serviceIds.length);
      }

      return {
        ...state,
        packageDetails: {
          ...state.packageDetails,
          services: services
        }
      };
    }

    case buildingServicesAction.UPDATE_SERVICE_CHARGING_METHOD: {
      const {payload} = action;
      const {serviceId, chargingMethod} = payload;

      let services: any = state.packageDetails.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        const result = Object.assign({}, service);
        result.chargingMethod = chargingMethod;

        return result;
      });

      return {
        ...state,
        packageDetails: {
          ...state.packageDetails,
          services: services
        }
      };
    }

    case buildingServicesAction.UPDATE_SERVICE_VALUE: {
      const {payload} = action;
      const {serviceId, supplyType, field, value} = payload;

      let services: any = state.packageDetails.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        const result = Object.assign({}, service);
        result[supplyType][field] = +value;
        result[supplyType][field + 'Changed'] = true;

        return result;
      });

      return {
        ...state,
        packageDetails: {
          ...state.packageDetails,
          services: services
        }
      };
    }

    case buildingServicesAction.UPDATE_SERVICE_METER_VALUE: {
      const {payload} = action;
      const {serviceId, supplyType, value, meterId} = payload;

      let services: any = state.packageDetails.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        const result = Object.assign({}, service);
        result[supplyType] = Object.assign({}, service[supplyType]);
        result[supplyType].meterTypes = service[supplyType].meterTypes.map(meterType => {
          if (meterType.id != meterId) {
            return meterType;
          }

          return Object.assign({}, meterType, {value: +value, meterChanged: true});
        });

        return result;
      });

      return {
        ...state,
        packageDetails: {
          ...state.packageDetails,
          services: services
        }
      };
    }

    case buildingServicesAction.UPDATE_CHARGING_TYPE: {
      const {payload} = action;
      const {serviceId, value} = payload;

      let services: any = state.packageDetails.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        service = Object.assign({}, service);
        service.chargingType = value;
        return service;
      });

      return {
        ...state,
        packageDetails: {
          ...state.packageDetails,
          services: services
        }
      };
    }

    case buildingServicesAction.RESET_BUILDING_SERVICES: {
      return {
        ...state,
        packages: [],
        packageDetails: null,
        packagesTotal: 0
      };
    }

    default:
      return state;
  }

}

export const getPackages = (state: State) => state.packages;
export const getPackageDetails = (state: State) => state.packageDetails;
export const getSearchTerm = (state: State) => state.searchTerm;
export const getPage = (state: State) => state.page;
export const getShowPrice = (state: State) => state.isShowPrice;
export const getServiceFilter = (state: State) => state.serviceFilter;
export const getPackageCategoryFilter = (state: State) => state.packageCategoryFilter;
export const getPackagesTotal = (state: State) => state.packagesTotal;
export const getPageSize = (state: State) => state.pageSize;
export const getIsCompleted = (state: State) => state.isCompleted;

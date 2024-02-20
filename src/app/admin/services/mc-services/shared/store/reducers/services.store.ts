import * as servicesAction from '../actions/services.actions';

import {ServiceCategoryType, ServiceStatusFilter, ServiceViewModel} from '@models';
import {InputEx} from '@shared-helpers';

export interface State {
  services: ServiceViewModel[];
  isShowPrice: boolean;
  serviceFilter: ServiceStatusFilter;
  serviceCategoryFilter: ServiceCategoryType;
}

export const initialState: State = {
  services: [],
  isShowPrice: true,
  serviceFilter: ServiceStatusFilter.AllServices,
  serviceCategoryFilter: ServiceCategoryType.AllCategories
}

export function reducer(state = initialState, action: servicesAction.Action) {
  switch (action.type) {

    case servicesAction.GET_SERVICES_REQUEST: {

      return {
        ...state,
        isShowPrice: true,
        serviceFilter: ServiceStatusFilter.AllServices,
        serviceCategoryFilter: ServiceCategoryType.AllCategories,
        services: []
      }
    }

    case servicesAction.GET_SERVICES_REQUEST_COMPLETE: {

      return {
        ...state,
        services: action.payload
      }
    }

    case servicesAction.UPDATE_SERVICE_STATUS_REQUEST_COMPLETE: {
      const {payload} = action;
      const {serviceId, value} = payload;

      let services = state.services;

      if (value) {
        // enable all parent
        let nextId = serviceId;
        while (nextId) {
          services = InputEx.updateService(nextId, services, (service) => {
            let result = Object.assign({}, service);
            result.isActive = value;
            nextId = service.parentId;
            return result;
          });
        }
      } else {
        // disable all children
        let serviceIds = new Array<string>();
        serviceIds.push(serviceId);

        do {
          let nextId = serviceIds.pop();
          services = InputEx.updateService(nextId, services, (service) => {
            let result = Object.assign({}, service);
            result.isActive = value;
            result.services.forEach(subService => {
              serviceIds.push(subService.id);
            });
            return result;
          });
        } while (serviceIds.length)
      }

      return {
        ...state,
        services: services
      }
    }

    case servicesAction.TOGGLE_DISPLAY_PRICE: {

      return {
        ...state,
        isShowPrice: !state.isShowPrice
      }
    }

    case servicesAction.TOGGLE_SERVICE_EXPNAD: {
      let services = InputEx.updateService(action.payload, state.services, (service) => {
        let result = Object.assign({}, service);
        result.isExpanded = !service.isExpanded;

        return result;
      });

      return {
        ...state,
        services: services
      }
    }

    case servicesAction.UPDATE_SERVICE: {
      const destService = action.payload;

      let previousState = InputEx.getServiceById(destService.id, state.services)

      let services = InputEx.updateService(destService.id, state.services, (srcService) => {
        let srcServices = srcService.services;
        let result = Object.assign({}, srcService, destService, {services: srcServices});

        return result;
      });

      if (previousState.isActive != destService.isActive) {
        let value = destService.isActive;
        let serviceId = destService.id;

        if (value) {
          // enable all parent
          let nextId = serviceId;
          while (nextId) {
            services = InputEx.updateService(nextId, services, (service) => {
              let result = Object.assign({}, service);
              result.isActive = value;
              nextId = service.parentId;
              return result;
            });
          }
        } else {
          // disable all children
          let serviceIds = new Array<string>();
          serviceIds.push(serviceId);

          do {
            let nextId = serviceIds.pop();
            services = InputEx.updateService(nextId, services, (service) => {
              let result = Object.assign({}, service);
              result.isActive = value;
              result.services.forEach(subService => {
                serviceIds.push(subService.id);
              });
              return result;
            });
          } while (serviceIds.length)
        }
      }

      return {
        ...state,
        services: services
      }
    }

    case servicesAction.ADD_SERVICE: {
      const {payload} = action;

      let services;
      if (payload.parentId) {
        services = InputEx.updateService(payload.parentId, state.services, (srcService) => {
          let result = Object.assign({}, srcService);
          result.services = [...srcService.services, payload];

          return result;
        });
      } else {
        services = [...state.services, payload];
      }

      return {
        ...state,
        services: services
      }
    }

    case servicesAction.UPDATE_SERVICE_FILTER: {
      const {payload} = action;

      return {
        ...state,
        serviceFilter: payload
      }
    }

    case servicesAction.UPDATE_SERVICE_CATEGORY_FILTER: {
      const {payload} = action;

      return {
        ...state,
        serviceCategoryFilter: payload
      }
    }

    default:
      return state;
  }

}

export const getServices = (state: State) => state.services;
export const getShowPrice = (state: State) => state.isShowPrice;
export const getServiceFilter = (state: State) => state.serviceFilter;
export const getServiceCategoryFilter = (state: State) => state.serviceCategoryFilter;


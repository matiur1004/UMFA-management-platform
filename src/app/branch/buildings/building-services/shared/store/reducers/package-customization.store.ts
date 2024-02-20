import * as packageCustomizationAction from '../actions/package-customization.actions';

import {PackageServiceViewModel} from '@models';
import {InputEx} from '@shared-helpers';

export interface State {
  services: PackageServiceViewModel[];
  totalPrice: number;
  numberOfTenants: number;
  numberOfShops: number;
  numberOfMeters: number;
  numberOfSqMetres: number;
  numberOfCouncilAcc: number;
  numberOfHours: number;
}

export const initialState: State = {
  services: [],
  totalPrice: 0,
  numberOfTenants: 0,
  numberOfShops: 0,
  numberOfMeters: 0,
  numberOfSqMetres: 0,
  numberOfCouncilAcc: 0,
  numberOfHours: 0
}

export function reducer(state = initialState, a: packageCustomizationAction.Action) {
  switch (a.type) {
    case packageCustomizationAction.UPDATE_SERVICES_COMPLETE:
    case packageCustomizationAction.UPDATE_SERVICES: {
      return {
        ...state,
        services: [...a.payload]
      };
    }

    case packageCustomizationAction.UPDATE_ITEMS_COUNT: {
      let {payload} = a;

      return {
        ...state,
        numberOfTenants: payload.numberOfTenants,
        numberOfShops: payload.numberOfShops,
        numberOfMeters: payload.numberOfMeters,
        numberOfSqMetres: payload.numberOfSqMetres,
        numberOfCouncilAcc: payload.numberOfCouncilAcc,
        numberOfHours: payload.numberOfHours
      };
    }

    case packageCustomizationAction.UPDATE_TOTAL_PRICE: {
      return {
        ...state,
        totalPrice: a.payload
      };
    }


    case packageCustomizationAction.GET_SERVICES_REQUEST_COMPLETE:
      return {
        ...state,
        services: [...a.payload]
      };

    case packageCustomizationAction.TOGGLE_SERVICE_EXPNAD: {
      let services = InputEx.updateService(a.payload, state.services, (service) => {
        service = Object.assign({}, service);
        service.isExpanded = !service.isExpanded;
        return service;
      });

      return {
        ...state,
        services: services
      }
    }

    case packageCustomizationAction.UPDATE_SERVICE_STATUS: {
      const {payload} = a;
      const {serviceId, value} = payload;

      let services: any = state.services;

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

    case packageCustomizationAction.UPDATE_SERVICE_VALUE: {
      const {payload} = a;
      const {serviceId, supplyType, field, value} = payload;

      let services: any = state.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        let result = Object.assign({}, service);
        result[supplyType][field] = +value;
        result[supplyType][field + 'Changed'] = true;

        return result;
      });

      return {
        ...state,
        services: services
      }
    }

    case packageCustomizationAction.UPDATE_CHARGING_METHOD: {
      const {payload} = a;
      const {serviceId, chargingMethod} = payload;

      let services: any = state.services;

      services = InputEx.updateService(serviceId, services, (service) => {
        let result = Object.assign({}, service);
        result.chargingMethod = chargingMethod;
        return result;
      });

      return {
        ...state,
        services: services
      }
    }

    default:
      return state;
  }
}

export const getServices = (state: State) => state.services;
export const getTotalPrice = (state: State) => state.totalPrice;

import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer,} from '@ngrx/store';

import * as fromServices from './building-services.store';
import * as fromPackageCustomization from './package-customization.store';
import {InputEx} from '@shared-helpers';
import {getChargingMethodTitle, ServiceCategoryType, ServiceCountBuilder} from '@models';
import {BuildingServicesCalc} from '../building-services-calc';

export interface State {
  BuildingServices: fromServices.State;
  PackageCustomization: fromPackageCustomization.State;
}

export const reducers = combineReducers<State, any>({
  BuildingServices: fromServices.reducer,
  PackageCustomization: fromPackageCustomization.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];


export const getState = createFeatureSelector<State>('buildingServices');

export const getServicesState = createSelector(
  getState,
  state => state.BuildingServices
);

export const getPackageCustomizationState = createSelector(
  getState,
  state => state.PackageCustomization
);

export const getQuantity = createSelector(
  getServicesState,
  (state) => {

    if (!state.packageDetails) {
      return null;
    }

    const packageDetail = state.packageDetails;

    let meterTypes = {};

    if (packageDetail.meterTypes.length) {
      meterTypes = packageDetail.meterTypes.reduce((acc, mt) => {
        acc[mt.id] = {...mt};
        return acc;
      });
    }

    return {
      meterTypes: meterTypes,
      numberOfCouncilAcc: packageDetail.numberOfCouncilAcc,
      numberOfHours: packageDetail.numberOfHours,
      numberOfShops: packageDetail.numberOfShops,
      numberOfMeters: packageDetail.numberOfMeters,
      numberOfTenants: packageDetail.numberOfTenants,
      numberOfSqMetres: packageDetail.numberOfSqMetres
    };
  }
);


export const getPackageDetails = createSelector(
  getServicesState,
  fromServices.getPackageDetails
);

export const getServices = createSelector(
  getPackageDetails,
  (packageDetails) => packageDetails ? packageDetails.services : []
);

export const getActiveServices = createSelector(
  getServices,
  (services: any) => {
    return InputEx.getServicesByFilter(services, (service) => service.isActive);
  }
);

export const getCustomizationTotal = createSelector(
  getPackageDetails,
  getActiveServices,
  getQuantity,
  (packageDetail, services, quantity) => {

    if (!packageDetail || !services || !quantity) {
      return 0;
    }

    const r = BuildingServicesCalc.calculateCustomTotalPrice(services, {
      hasElectricitySupplier: packageDetail.hasElectricitySupplier,
      hasWaterSupplier: packageDetail.hasWaterSupplier,
      hasSewerageSupplier: packageDetail.hasSewerageSupplier,
      hasGasSupplier: packageDetail.hasGasSupplier,
      hasAdHocSupplier: packageDetail.hasAdHocSupplier
    }, quantity);

    return r;
  }
);

export const getCustomizationDetail = createSelector(
  getServicesState,
  getQuantity,
  (state, quantity) => {

    if (!state.packageDetails || !quantity) {
      return [];
    }

    const packageDetail = state.packageDetails;
    const result = [];

    InputEx.getServiceEnumerator(<any>packageDetail.services, (service: any, _) => {

      const unitPrice = BuildingServicesCalc.getCostPerUnit(service, packageDetail);
      const quantityOfServiceType = BuildingServicesCalc.getQuantityForService(service, quantity);
      if (unitPrice == 0 || quantityOfServiceType == 0) {
        return;
      }

      const item = {};
      item['name'] = service.name;
      item['chargingName'] = getChargingMethodTitle(service.chargingMethod);
      item['totalPrice'] = BuildingServicesCalc.calculateCustomPrice(service, packageDetail, quantity);

      item['unitPrice'] = unitPrice;
      item['quantity'] = quantityOfServiceType == null ? '-' : quantityOfServiceType;

      result.push(item);
    });

    return result;
  }
);

export const getPackages = createSelector(
  getServicesState,
  fromServices.getPackages
);


export const getCustomizationServices = createSelector(
  getPackageCustomizationState,
  fromPackageCustomization.getServices
);


export const getFlatCustomizationServices = createSelector(
  getActiveServices,
  (services) => {
    const flatServices = new Array<any>();

    InputEx.getServiceEnumerator(services, (service) => {
      flatServices.push(Object.assign({}, service, {services: []}));
    });

    return flatServices;
  }
);

export const getShowPrice = createSelector(
  getServicesState,
  fromServices.getShowPrice
);

export const getPage = createSelector(
  getServicesState,
  fromServices.getPage
);

export const getPackagesTolal = createSelector(
  getServicesState,
  fromServices.getPackagesTotal
);

export const getPageSize = createSelector(
  getServicesState,
  fromServices.getPageSize
);

export const getIsCompleted = createSelector(
  getServicesState,
  fromServices.getIsCompleted
);


export const getServiceFilter = createSelector(
  getServicesState,
  fromServices.getServiceFilter
);

export const getPackageCategoryFilter = createSelector(
  getServicesState,
  fromServices.getPackageCategoryFilter
);

const hasServiceCategory = (serviceItem, categoryFilter) => serviceItem.serviceCategory == categoryFilter;


export const getServicesWithFilter = createSelector(
  getActiveServices,
  getServiceFilter,
  (services, filter) => {

    if (filter == ServiceCategoryType.AllCategories) {
      return services;
    }

    const filteredServices = new Array<any>();
    InputEx.getServiceEnumerator(<any>services, (service) => {
      let shouldAdd = true;

      if (shouldAdd && filter != ServiceCategoryType.AllCategories) {
        let hasCurrentCategory = hasServiceCategory(service.adHoc, filter);
        if (!hasCurrentCategory) {
          hasCurrentCategory = hasServiceCategory(service.electricity, filter);
        }
        if (!hasCurrentCategory) {
          hasCurrentCategory = hasServiceCategory(service.water, filter);
        }
        if (!hasCurrentCategory) {
          hasCurrentCategory = hasServiceCategory(service.gas, filter);
        }
        if (!hasCurrentCategory) {
          hasCurrentCategory = hasServiceCategory(service.sewerage, filter);
        }

        shouldAdd = hasCurrentCategory;
      }

      if (shouldAdd) {
        filteredServices.push(Object.assign({}, service, {services: []}));
      }

    });

    return filteredServices;
  }
);

export const getServiceCount = createSelector(
  getServicesWithFilter,
  (services) => {
    const countBuilder = new ServiceCountBuilder();

    InputEx.getServiceEnumerator(services, (service, path) => {

      countBuilder.allItemsCount++;
      switch (path) {
        case 0:
          countBuilder.firstLevelCount++;
          break;

        case 1:
          countBuilder.secondLevelCount++;
          break;

        case 2:
          countBuilder.thirdLevelCount++;
          break;

        case 3:
          countBuilder.fourthLevelCount++;
          break;

        default:
          break;
      }
    });

    return countBuilder.build();
  }
);

export const getPackagesCount = createSelector(
  getServicesState,
  (state) => {
    let start = ((state.page - 1) * state.pageSize) + 1;
    let end = start + state.pageSize - 1;

    start = start < state.packagesTotal ? start : state.packagesTotal;
    end = end < state.packagesTotal ? end : state.packagesTotal;

    return start + '-' + end + ' of ' + state.packagesTotal;
  }
);

export const getTenantPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfTenants;

      if (state.isCompleted) {
        price.per = detail.perTenant;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perTenant;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perTenant;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perTenant;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perTenant;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perTenant;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);

export const getShopPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfShops;

      if (state.isCompleted) {
        price.per = detail.perShop;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perShop;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perShop;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perShop;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perShop;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perShop;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);

export const getMeterPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfMeters;

      if (state.isCompleted) {
        price.per = detail.perMeter;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perMeter;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perMeter;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perMeter;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perMeter;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perMeter;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);

export const getSqMeterPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfSqMetres;

      if (state.isCompleted) {
        price.per = detail.perSquareMeter;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perSquareMeter;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perSquareMeter;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perSquareMeter;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perSquareMeter;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perSquareMeter;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);

export const getCouncilAccPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfCouncilAcc;

      if (state.isCompleted) {
        price.per = detail.perCouncilAccount;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perCouncilAccount;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perCouncilAccount;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perCouncilAccount;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perCouncilAccount;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perCouncilAccount;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);


export const getHourPriceHeader = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    const price = {
      total: 0,
      per: 0,
      count: 0
    };

    if (detail) {
      price.count = detail.numberOfHours;

      if (state.isCompleted) {
        price.per = detail.perHour;
      } else {
        if (detail.hasAdHocSupplier) {
          price.per += detail.adHocSupplierPrice.perHour;
        }
        if (detail.hasGasSupplier) {
          price.per += detail.gasSupplierPrice.perHour;
        }
        if (detail.hasWaterSupplier) {
          price.per += detail.waterSupplierPrice.perHour;
        }
        if (detail.hasSewerageSupplier) {
          price.per += detail.sewerageSupplierPrice.perHour;
        }
        if (detail.hasElectricitySupplier) {
          price.per += detail.electricitySupplierPrice.perHour;
        }
      }

      price.total = price.per * price.count;
    }

    return price;
  }
);

export const getBuildingPrice = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    let price = 0;

    if (detail) {
      if (state.isCompleted) {
        price = detail.perBuilding;
      } else {
        if (detail.hasAdHocSupplier) {
          price += detail.adHocSupplierPrice.perBuilding;
        }
        if (detail.hasGasSupplier) {
          price += detail.gasSupplierPrice.perBuilding;
        }
        if (detail.hasWaterSupplier) {
          price += detail.waterSupplierPrice.perBuilding;
        }
        if (detail.hasSewerageSupplier) {
          price += detail.sewerageSupplierPrice.perBuilding;
        }
        if (detail.hasElectricitySupplier) {
          price += detail.electricitySupplierPrice.perBuilding;
        }
      }
    }

    return price;
  }
);

export const getFixedPrice = createSelector(
  getServicesState,
  getPackageDetails,
  (state: any, detail: any) => {
    let price = 0;

    if (detail) {
      if (state.isCompleted) {
        price = detail.fixedPrice;
      } else {
        if (detail.hasAdHocSupplier) {
          price += detail.adHocSupplierPrice.fixedPrice;
        }
        if (detail.hasGasSupplier) {
          price += detail.gasSupplierPrice.fixedPrice;
        }
        if (detail.hasWaterSupplier) {
          price += detail.waterSupplierPrice.fixedPrice;
        }
        if (detail.hasSewerageSupplier) {
          price += detail.sewerageSupplierPrice.fixedPrice;
        }
        if (detail.hasElectricitySupplier) {
          price += detail.electricitySupplierPrice.fixedPrice;
        }
      }
    }

    return price;
  }
);

export const getMeterTypesDetail = createSelector(
  getActiveServices,
  getPackageDetails,
  (s, detail) => {
    let meterTypes = [];

    InputEx.getServiceEnumerator(s, service => {
      if (detail.hasElectricitySupplier) {
        meterTypes = meterTypes.concat(service.electricity.meterTypes);
      }
      if (detail.hasWaterSupplier) {
        meterTypes = meterTypes.concat(service.water.meterTypes);
      }
      if (detail.hasGasSupplier) {
        meterTypes = meterTypes.concat(service.gas.meterTypes);
      }
      if (detail.hasSewerageSupplier) {
        meterTypes = meterTypes.concat(service.sewerage.meterTypes);
      }
      if (detail.hasAdHocSupplier) {
        meterTypes = meterTypes.concat(service.adHoc.meterTypes);
      }
    });

    if (detail) {
      return detail.meterTypes.filter(m => m.quantity).map((meter: any) => {
        const result = Object.assign({}, meter);
        const serviceMeterTypesSum = meterTypes.filter(mt => mt.id == meter.id).reduce((acc, meter) => acc + meter.value, 0);
        result.quantity = meter.quantity;
        result.value = serviceMeterTypesSum;

        return result;
      }).filter(m => m.value > 0);
    }
  }
);

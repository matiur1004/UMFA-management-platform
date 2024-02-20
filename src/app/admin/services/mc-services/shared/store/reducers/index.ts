import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer,} from '@ngrx/store';

import * as fromServices from './services.store';
import * as fromServiceForm from './service-form.store';
import {InputEx} from '@shared-helpers';
import {ServiceCategoryType, ServiceCountBuilder, ServiceStatusFilter, SupplyType} from '@models';

export interface State {
  mcServices: fromServices.State,
  mcServiceForm: fromServiceForm.State
}

export const reducers = combineReducers<State, any>({
  mcServices: fromServices.reducer,
  mcServiceForm: fromServiceForm.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];


const _getState = createFeatureSelector<State>('mcServices');

export const getFormState = createSelector(
  _getState,
  state => state.mcServiceForm
);

export const getServicesState = createSelector(
  _getState,
  state => state.mcServices
);

export const getForm = createSelector(
  getFormState,
  fromServiceForm.getFormSate
);

export const getFormMeterTypes = createSelector(
  getFormState,
  fromServiceForm.getAllMeterTypes
);

export const getServices = createSelector(
  getServicesState,
  fromServices.getServices
);


export const getShowPrice = createSelector(
  getServicesState,
  fromServices.getShowPrice
);

export const getIsNew = createSelector(
  getFormState,
  fromServiceForm.getIsNew
);

export const getIsComplete = createSelector(
  getFormState,
  fromServiceForm.getIsComplete
);

export const getServiceFilter = createSelector(
  getServicesState,
  fromServices.getServiceFilter
);

export const getServiceCategoryFilter = createSelector(
  getServicesState,
  fromServices.getServiceCategoryFilter
);


export const getServicesWithFilter = createSelector(
  getServices,
  getServiceFilter,
  getServiceCategoryFilter,
  (services, filter, categoryFilter) => {

    if (filter == ServiceStatusFilter.AllServices && categoryFilter == ServiceCategoryType.AllCategories) {
      InputEx.calcNumberOfChildrenForServices(services);
      return services;
    }


    let filteredServices = new Array<any>();
    InputEx.getServiceEnumerator(services, (service) => {
      let shouldAdd = true;

      if (filter != ServiceStatusFilter.AllServices) {
        shouldAdd = (filter == ServiceStatusFilter.ActiveServices && service.isActive) || (filter == ServiceStatusFilter.InactiveServices && !service.isActive)
      }

      if (shouldAdd && categoryFilter != ServiceCategoryType.AllCategories) {
        let hasCurrentCategory = service.serviceCategoryIsFullMetering && (categoryFilter == ServiceCategoryType.FullMetering);
        if (!hasCurrentCategory) hasCurrentCategory = service.serviceCategoryIsPartialMetering && (categoryFilter == ServiceCategoryType.PartialMetering);
        if (!hasCurrentCategory) hasCurrentCategory = service.serviceCategoryIsPrepaidMetering && (categoryFilter == ServiceCategoryType.PrepaidMetering);
        if (!hasCurrentCategory) hasCurrentCategory = service.serviceCategoryIsSingleTenant && (categoryFilter == ServiceCategoryType.SingleTenant);

        shouldAdd = hasCurrentCategory;
      }

      if (shouldAdd)
        filteredServices.push(Object.assign({}, service, {services: []}));

    });

    InputEx.calcNumberOfChildrenForServices(filteredServices);
    return filteredServices;
  }
);

export const getServiceCount = createSelector(
  getServicesWithFilter,
  (services) => {
    let countBuilder = new ServiceCountBuilder();

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
)

const getExcludedMeterTypesBySupplier = (supplierType: SupplyType, includedMeterTypeIds: string[], allMeterTypes) => {
  return allMeterTypes.filter(meterType => {
    if (meterType.supplyType != supplierType || includedMeterTypeIds.find(id => id == meterType.id))
      return false;

    return true;
  }).map(meterType => Object.assign({}, meterType))
}

export const getElectricityExcludedMeterTypes = createSelector(
  getForm,
  getFormMeterTypes,
  (form, allMeterTypes) => {
    let includedMeterTypeIds = form.value.electricity.meterTypes.map(meterType => meterType.id);
    return getExcludedMeterTypesBySupplier(SupplyType.Electricity, includedMeterTypeIds, allMeterTypes);
  }
)

export const getWaterExcludedMeterTypes = createSelector(
  getForm,
  getFormMeterTypes,
  (form, allMeterTypes) => {
    let includedMeterTypeIds = form.value.water.meterTypes.map(meterType => meterType.id);
    return getExcludedMeterTypesBySupplier(SupplyType.Water, includedMeterTypeIds, allMeterTypes);
  }
)

export const getGasExcludedMeterTypes = createSelector(
  getForm,
  getFormMeterTypes,
  (form, allMeterTypes) => {
    let includedMeterTypeIds = form.value.gas.meterTypes.map(meterType => meterType.id);
    return getExcludedMeterTypesBySupplier(SupplyType.Gas, includedMeterTypeIds, allMeterTypes);
  }
)

export const getSewerageExcludedMeterTypes = createSelector(
  getForm,
  getFormMeterTypes,
  (form, allMeterTypes) => {
    let includedMeterTypeIds = form.value.sewerage.meterTypes.map(meterType => meterType.id);
    return getExcludedMeterTypesBySupplier(SupplyType.Sewerage, includedMeterTypeIds, allMeterTypes);
  }
)

export const getAdHocExcludedMeterTypes = createSelector(
  getForm,
  getFormMeterTypes,
  (form, allMeterTypes) => {
    let includedMeterTypeIds = form.value.adHoc.meterTypes.map(meterType => meterType.id);
    return getExcludedMeterTypesBySupplier(SupplyType.AdHoc, includedMeterTypeIds, allMeterTypes);
  }
)


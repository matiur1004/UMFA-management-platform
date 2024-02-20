import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer,} from '@ngrx/store';

import * as fromPackages from './packages.store';
import * as fromPackageForm from './package-form.store';

import {InputEx} from '@shared-helpers';
import {PackageCategory, ServiceCategoryType, ServiceCountBuilder, ServiceStatusFilter} from '@models';

export interface State {
  Packages: fromPackages.State;
  PackageForm: fromPackageForm.State;
}

export const reducers = combineReducers<State, any>({
  Packages: fromPackages.reducer,
  PackageForm: fromPackageForm.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];


const _getState = createFeatureSelector<State>('Packages');

export const getFormState = createSelector(
  _getState,
  state => state.PackageForm
);

export const getPackagesState = createSelector(
  _getState,
  state => state.Packages
);

export const getForm = createSelector(
  getFormState,
  fromPackageForm.getFormSate
);

export const getPackages = createSelector(
  getPackagesState,
  fromPackages.getPackages
);

export const getIsNew = createSelector(
  getFormState,
  fromPackageForm.getIsNew
);

export const getIsComplete = createSelector(
  getFormState,
  fromPackageForm.getIsComplete
);

export const getPage = createSelector(
  getPackagesState,
  fromPackages.getPage
);

export const getPackagesOrder = createSelector(
  getPackagesState,
  fromPackages.getPackagesOrder
);

export const getPackagesCategory = createSelector(
  getPackagesState,
  fromPackages.getPackagesCategory
);


export const getServices = createSelector(
  getFormState,
  fromPackageForm.getServices
);

export const getServiceFilter = createSelector(
  getFormState,
  fromPackageForm.getServiceFilter
);

export const getServiceCategoryFilter = createSelector(
  getFormState,
  fromPackageForm.getPackageCategoryFilter
);

export const getShowPrice = createSelector(
  getFormState,
  fromPackageForm.getShowPrice
);

export const getTotalItems = createSelector(
  getPackagesState,
  fromPackages.getTotalItems
);

export const getItemsPerPage = createSelector(
  getPackagesState,
  fromPackages.getItemsPerPage
);

export const getServicesWithFilter = createSelector(
  getServices,
  getServiceFilter,
  getServiceCategoryFilter,
  (services, filter, categoryFilter) => {
    if (filter == ServiceStatusFilter.AllServices && categoryFilter == ServiceCategoryType.AllCategories)
      return services;

    let filteredServices = new Array<any>();
    InputEx.getServiceEnumerator(<any>services, (service) => {
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

    return filteredServices;
  }
)

export const getPackagesWithFilter = createSelector(
  getPackages,
  getPackagesCategory,
  (packages, filter) => {
    if (filter == PackageCategory.AllCategories)
      return packages;

    let filteredPackages = new Array<any>();
    packages.forEach((p) => {
      let hasCurrentCategory = p.packageCategoryIsFullMetering && (filter == PackageCategory.FullMetering);
      if (!hasCurrentCategory) hasCurrentCategory = p.packageCategoryIsPartialMetering && (filter == PackageCategory.PartialMetering);
      if (!hasCurrentCategory) hasCurrentCategory = p.packageCategoryIsPrepaidMetering && (filter == PackageCategory.PrepaidMetering);
      if (!hasCurrentCategory) hasCurrentCategory = p.packageCategoryIsSingleTenant && (filter == PackageCategory.SingleTenant);

      if (hasCurrentCategory)
        filteredPackages.push(Object.assign({}, p, {packages: []}));

    });

    return filteredPackages;
  }
)

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
);

export const getRecommendSum = createSelector(
  getFormState,
  fromPackageForm.getRecommendedPrices
);

export const getDisplayOptions = createSelector(
  getForm,
  (form) => {
    let state = form.value;

    return {
      shouldDisplayFixedPriceMethod: state.hasFixedPriceMethod || state.hasCustomMethod,
      shouldDisplayPerTenantMethod: state.hasPerTenantMethod || state.hasCustomMethod,
      shouldDisplayPerShopMethod: state.hasPerShopMethod || state.hasCustomMethod,
      shouldDisplayPerMeterMethod: state.hasPerMeterMethod || state.hasCustomMethod,
      shouldDisplayPerSQMeterMethod: state.hasPerSQMeterMethod || state.hasCustomMethod,
      shouldDisplayPerBuildingMethod: state.hasPerBuildingMethod || state.hasCustomMethod,
      shouldDisplayPerCouncilAccountMethod: state.hasPerCouncilAccountMethod || state.hasCustomMethod,
      shouldDisplayPerHourMethod: state.hasPerHourMethod || state.hasCustomMethod
    };
  }
)

export const getItemsDetails = createSelector(
  getPackagesWithFilter,
  getTotalItems,
  getPage,
  getItemsPerPage,
  (packages, totalItems, page, itemsPerPage) => {
    let text = '';

    if (itemsPerPage !== null) {
      let start = page * itemsPerPage - itemsPerPage + 1;
      let end = page * itemsPerPage;

      if (start > totalItems) {
        start = totalItems;
      }
      if (end > totalItems) {
        end = totalItems;
      }

      text = 'Showing ' + start + '-' + end + ' of ' + totalItems + ' packages';
    } else {
      text = 'Showing all ' + totalItems + ' packages';
    }

    return text;
  }
);

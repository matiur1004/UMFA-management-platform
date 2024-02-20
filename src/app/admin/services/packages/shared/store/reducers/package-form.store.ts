import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  SetValueAction,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

import * as packageFormActions from '../actions/package-form.actions';
import {greaterThanOrEqualTo, lessThan, lessThanOrEqualTo, maxLength, required} from 'ngrx-forms/validation';
import {
  PackageMeterTypeViewModel,
  PackageServiceViewModel,
  RecommendedPriceViewModel,
  ServiceCategoryType,
  ServiceStatusFilter,
  SupplierPriceViewModel
} from '@models';
import {InputEx} from '@shared-helpers';
import {PackagesEx} from '../packages-ex';

export interface FormValue {
  id: string;
  name: string;
  isActive: boolean;
  regNumber: string;
  color: string;

  packageCategoryIsFullMetering: boolean;
  packageCategoryIsPartialMetering: boolean;
  packageCategoryIsPrepaidMetering: boolean;
  packageCategoryIsSingleTenant: boolean;

  hasElectricitySupplier: boolean;
  hasWaterSupplier: boolean;
  hasGasSupplier: boolean;
  hasSewerageSupplier: boolean;
  hasAdHocSupplier: boolean;

  hasFixedPriceMethod: boolean;
  hasPerTenantMethod: boolean;
  hasPerShopMethod: boolean;
  hasPerMeterMethod: boolean;
  hasPerSQMeterMethod: boolean;
  hasPerBuildingMethod: boolean;
  hasPerCouncilAccountMethod: boolean;
  hasPerHourMethod: boolean;
  hasCustomMethod: boolean;

  electricitySupplierPrice: SupplierPriceViewModel;
  waterSupplierPrice: SupplierPriceViewModel;
  gasSupplierPrice: SupplierPriceViewModel;
  sewerageSupplierPrice: SupplierPriceViewModel;
  adHocSupplierPrice: SupplierPriceViewModel;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  name: '',
  isActive: true,
  regNumber: '',
  color: '',
  packageCategoryIsFullMetering: true,
  packageCategoryIsPartialMetering: false,
  packageCategoryIsPrepaidMetering: false,
  packageCategoryIsSingleTenant: false,

  hasElectricitySupplier: true,
  hasWaterSupplier: true,
  hasGasSupplier: true,
  hasSewerageSupplier: true,
  hasAdHocSupplier: true,

  hasFixedPriceMethod: true,
  hasPerTenantMethod: true,
  hasPerShopMethod: true,
  hasPerMeterMethod: true,
  hasPerSQMeterMethod: true,
  hasPerBuildingMethod: true,
  hasPerCouncilAccountMethod: true,
  hasPerHourMethod: true,
  hasCustomMethod: false,

  electricitySupplierPrice: PackagesEx.getDefaultSupplierPrice(),
  waterSupplierPrice: PackagesEx.getDefaultSupplierPrice(),
  gasSupplierPrice: PackagesEx.getDefaultSupplierPrice(),
  sewerageSupplierPrice: PackagesEx.getDefaultSupplierPrice(),
  adHocSupplierPrice: PackagesEx.getDefaultSupplierPrice()
};

export const FORM_ID = 'packageForm';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  isNew: boolean;
  isComplete: boolean;
  services: PackageServiceViewModel[];
  serviceFilter: ServiceStatusFilter;
  isShowPrice: boolean;
  categoryServiceFilter: ServiceCategoryType;
  recommendedPrices: RecommendedPriceViewModel;
}

const detectChangesFn = (propеrty) => {
  return (control, parentGroupState) => {
    if (parentGroupState.controls[propеrty].isDirty) {
      return setValue(control, true);
    }
    return control;
  };
};

const updateChangesFn = (): any => {
  return {
    fixedPriceChanged: detectChangesFn('fixedPrice'),
    perTenantChanged: detectChangesFn('perTenant'),
    perShopChanged: detectChangesFn('perShop'),
    perSquareMeterChanged: detectChangesFn('perSquareMeter'),
    perBuildingChanged: detectChangesFn('perBuilding'),
    perCouncilAccountChanged: detectChangesFn('perCouncilAccount'),
    perMeterChanged: detectChangesFn('perMeter'),
    perHourChanged: detectChangesFn('perHour'),
    meterTypes: (control, _) => {
      const values = [];

      control.controls.forEach(c => {
        const value = c.value;
        value.meterChanged = c.isDirty;
        values.push(value);
      });

      return setValue(control, values);
    }
  };
};

const supplierValidationRulesFn = (): any => {
  return {
    fixedPrice: validate(greaterThanOrEqualTo(0), lessThan(999999999)),
    recomPrice: validate(greaterThanOrEqualTo(-100), lessThanOrEqualTo(100)),
    minimalFee: validate(required),
    perTenant: validate(required),
    perShop: validate(required),
    perMeter: validate(required),
    perSquareMeter: validate(required),
    meterTypes: updateArray(updateGroup<PackageMeterTypeViewModel>({
      value: validate(greaterThanOrEqualTo(0), lessThan(999999999)),
    }))
  };
};

const getRecommendedPrice = (price, previousRecomPrice, recomPrice) => {
  const hundredthPreviousRecomPrice = (previousRecomPrice / 100) === 0 ? 1 : (previousRecomPrice / 100);

  return (previousRecomPrice == -100 || recomPrice <= -100) ? Number((0).toFixed(2)) : Number(((price / hundredthPreviousRecomPrice) * (recomPrice / 100)).toFixed(2));
};

const getRecommendedMeterTypesPrice = (meterTypes, previousRecomPrice, recomPrice) => {
  meterTypes = meterTypes.map(mt => Object.assign({}, mt, {value: getRecommendedPrice(mt.value, previousRecomPrice, recomPrice)}));
  return setValue(meterTypes);
};

const getSupplierPrice = (state, previousState): any => {
  return {
    fixedPrice: setValue(getRecommendedPrice(state.value.fixedPrice, previousState.recomPrice, state.value.recomPrice)),
    perTenant: setValue(getRecommendedPrice(state.value.perTenant, previousState.recomPrice, state.value.recomPrice)),
    perShop: setValue(getRecommendedPrice(state.value.perShop, previousState.recomPrice, state.value.recomPrice)),
    perMeter: setValue(getRecommendedPrice(state.value.perMeter, previousState.recomPrice, state.value.recomPrice)),
    perSquareMeter: setValue(getRecommendedPrice(state.value.perSquareMeter, previousState.recomPrice, state.value.recomPrice)),
    perBuilding: setValue(getRecommendedPrice(state.value.perBuilding, previousState.recomPrice, state.value.recomPrice)),
    perCouncilAccount: setValue(getRecommendedPrice(state.value.perCouncilAccount, previousState.recomPrice, state.value.recomPrice)),
    meterTypes: getRecommendedMeterTypesPrice(state.value.meterTypes, previousState.recomPrice, state.value.recomPrice)
  };
};

const updateRecommendedPrices = (action, state, previousState) => {
  const a = action as SetValueAction<any>;
  const electricityRecomPriceId = state.controls.electricitySupplierPrice.controls.recomPrice.id;
  const waterRecomPriceId = state.controls.waterSupplierPrice.controls.recomPrice.id;
  const sewerageRecomPriceId = state.controls.sewerageSupplierPrice.controls.recomPrice.id;
  const gasRecomPriceId = state.controls.gasSupplierPrice.controls.recomPrice.id;
  const adHocRecomPriceId = state.controls.adHocSupplierPrice.controls.recomPrice.id;

  switch (a.controlId) {
    case electricityRecomPriceId: {
      return updateGroup<FormValue>({
        electricitySupplierPrice: (s) => {
          return updateGroup<SupplierPriceViewModel>(s, getSupplierPrice(s, previousState.value.electricitySupplierPrice));
        }
      })(state);
    }
    case waterRecomPriceId: {
      return updateGroup<FormValue>({
        waterSupplierPrice: (s) => {
          return updateGroup<SupplierPriceViewModel>(s, getSupplierPrice(s, previousState.value.waterSupplierPrice));
        }
      })(state);
    }
    case sewerageRecomPriceId: {
      return updateGroup<FormValue>({
        sewerageSupplierPrice: (s) => {
          return updateGroup<SupplierPriceViewModel>(s, getSupplierPrice(s, previousState.value.sewerageSupplierPrice));
        }
      })(state);
    }
    case gasRecomPriceId: {
      return updateGroup<FormValue>({
        gasSupplierPrice: (s) => {
          return updateGroup<SupplierPriceViewModel>(s, getSupplierPrice(s, previousState.value.gasSupplierPrice));
        }
      })(state);
    }
    case adHocRecomPriceId: {
      return updateGroup<FormValue>({
        adHocSupplierPrice: (s) => {
          return updateGroup<SupplierPriceViewModel>(s, getSupplierPrice(s, previousState.value.adHocSupplierPrice));
        }
      })(state);
    }
    default:
      return state;
  }
};

const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(150)),
  electricitySupplierPrice: (state, parentState) => {
    if (parentState.value.hasElectricitySupplier) {
      return updateGroup<SupplierPriceViewModel>(state, supplierValidationRulesFn(), updateChangesFn());
    }

    return updateGroup<SupplierPriceViewModel>(state, {});
  },
  waterSupplierPrice: (state, parentState) => {
    if (parentState.value.hasWaterSupplier) {
      return updateGroup<SupplierPriceViewModel>(state, supplierValidationRulesFn(), updateChangesFn());
    }

    return updateGroup<SupplierPriceViewModel>(state, {});
  },
  sewerageSupplierPrice: (state, parentState) => {
    if (parentState.value.hasSewerageSupplier) {
      return updateGroup<SupplierPriceViewModel>(state, supplierValidationRulesFn(), updateChangesFn());
    }

    return updateGroup<SupplierPriceViewModel>(state, {});
  },
  gasSupplierPrice: (state, parentState) => {
    if (parentState.value.hasGasSupplier) {
      return updateGroup<SupplierPriceViewModel>(state, supplierValidationRulesFn(), updateChangesFn());
    }

    return updateGroup<SupplierPriceViewModel>(state, {});
  },
  adHocSupplierPrice: (state, parentState) => {
    if (parentState.value.hasAdHocSupplier) {
      return updateGroup<SupplierPriceViewModel>(state, supplierValidationRulesFn(), updateChangesFn());
    }

    return updateGroup<SupplierPriceViewModel>(state, {});
  },
});

const reducers = combineReducers<State, any>({

  formState(s = InitState, a: Action) {
    const previousState = s;

    s = formGroupReducer(s, a);

    switch (a.type) {
      case SetValueAction.TYPE: {
        s = updateRecommendedPrices(a, s, previousState);
      }
    }

    return validateAndUpdateForm(s);
  },
  isNew(s: boolean, a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.EDIT_PACKAGE:
        return false;

      case packageFormActions.CREATE_PACKAGE:
        return true;

      default:
        return s;
    }
  },
  isComplete(s: boolean, a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.CREATE_PACKAGE:
      case packageFormActions.EDIT_PACKAGE:
        return false;

      case packageFormActions.SEND_PACKAGE_REQUEST_COMPLETE:
        return true;

      default:
        return s;
    }
  },
  services(s: PackageServiceViewModel[] = [], a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.SEND_PACKAGE_REQUEST_COMPLETE:
        return s;

      case packageFormActions.GET_PACKAGE_REQUEST_COMPLETE:
        return [...a.payload];

      case packageFormActions.TOGGLE_SERVICE_EXPNAD:
        return InputEx.updateService(a.payload, s, (service) => {
          service = Object.assign({}, service);
          service.isExpanded = !service.isExpanded;
          return service;
        });

      case packageFormActions.UPDATE_SERVICE_STATUS: {
        const {payload} = a;
        const {serviceId, value} = payload;

        let services: any = s;

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

        return services;
      }

      case packageFormActions.UPDATE_SERVICE_VALUE: {
        const {payload} = a;
        const {serviceId, supplyType, field, value} = payload;

        let services: any = s;

        services = InputEx.updateService(serviceId, services, (service) => {
          const result = Object.assign({}, service);
          result[supplyType][field] = +value;
          result[supplyType][field + 'Changed'] = true;

          return result;
        });

        return services;
      }

      case packageFormActions.UPDATE_SERVICE_METER_VALUE: {
        const {payload} = a;
        const {serviceId, supplyType, value, meterId} = payload;

        let services: any = s;

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

        return services;
      }

      case packageFormActions.UPDATE_SERVICE_CHARGING_METHOD: {
        const {payload} = a;
        const {serviceId, chargingMethod} = payload;

        let services: any = s;

        services = InputEx.updateService(serviceId, services, (service) => {
          const result = Object.assign({}, service);
          result.chargingMethod = chargingMethod;

          return result;
        });

        return services;

      }

      case packageFormActions.UPDATE_CHARGING_TYPE: {
        const {payload} = a;
        const {serviceId, value} = payload;

        const services: any = s;

        return InputEx.updateService(serviceId, services, (service) => {
          service = Object.assign({}, service);
          service.chargingType = value;
          return service;
        });
      }

      default:
        return s;
    }
  },
  serviceFilter(s: ServiceStatusFilter = ServiceStatusFilter.AllServices, a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.CREATE_PACKAGE:
      case packageFormActions.EDIT_PACKAGE:
        return ServiceStatusFilter.AllServices;

      case packageFormActions.UPDATE_SERVICE_FILTER:
        return a.payload;


      default:
        return s;
    }
  },
  isShowPrice(s: boolean, a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.CREATE_PACKAGE:
      case packageFormActions.EDIT_PACKAGE:
        return true;

      case packageFormActions.TOGGLE_DISPLAY_PRICE:
        return !s;

      default:
        return s;
    }
  },
  categoryServiceFilter(s: ServiceCategoryType = ServiceCategoryType.AllCategories, a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.UPDATE_SERVICE_CATEGORY_FILTER:
        return a.payload;

      default:
        return s;
    }
  },
  recommendedPrices(s: RecommendedPriceViewModel = new RecommendedPriceViewModel(), a: packageFormActions.Action) {
    switch (a.type) {
      case packageFormActions.UPDATE_RECOMMENDED_PRICES:
        return {
          ...a.payload
        };

      default:
        return s;
    }
  }
});


export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormSate = (state: State) => state.formState;
export const getIsNew = (state: State) => state.isNew;
export const getIsComplete = (state: State) => state.isComplete;
export const getServices = (state: State) => state.services;
export const getServiceFilter = (state: State) => state.serviceFilter;
export const getShowPrice = (state: State) => state.isShowPrice;
export const getPackageCategoryFilter = (state: State) => state.categoryServiceFilter;
export const getRecommendedPrices = (state: State) => state.recommendedPrices;




import {
  ChargingType,
  MeterTypesViewModel,
  MeterTypeViewModel,
  ServiceItemViewModel,
  ServiceViewModel,
  SupplyType
} from '@models';

export class InputEx {

  public static getDefaultServiceItemViewModel(meterTypes: MeterTypeViewModel[], supplyType: SupplyType):
    ServiceItemViewModel {
    return {
      id: '',
      isActive: false,
      fixedPrice: 0,
      minimalFee: 0,
      perTenant: 0,
      perShop: 0,
      perMeter: 0,
      perSquareMeter: 0,
      perBuilding: 0,
      perCouncilAccount: 0,
      perHour: 0,
      meterTypes: meterTypes.filter(m => m.supplyType === supplyType),
      recomFixedPrice: 0,
      recomPerBuilding: 0,
      recomPerCouncilAccount: 0,
      recomPerHour: 0,
      recomPerMeter: 0,
      recomPerShop: 0,
      recomPerSquareMeter: 0,
      recomPerTenant: 0,

      fixedPriceChanged: false,
      perTenantChanged: false,
      perShopChanged: false,
      perMeterChanged: false,
      perSquareMeterChanged: false,
      perBuildingChanged: false,
      perCouncilAccountChanged: false,
      perHourChanged: false
    };
  }

  public static getCreateServiceDefaultModel(meters: MeterTypesViewModel): ServiceViewModel {
    let service: ServiceViewModel = {
      id: '',
      name: '',
      parentId: '',
      description: '',
      isActive: true,
      chargingType: ChargingType.Regular,
      serviceCategoryIsFullMetering: true,
      serviceCategoryIsPartialMetering: false,
      serviceCategoryIsPrepaidMetering: false,
      serviceCategoryIsSingleTenant: false,
      electricity: InputEx.getDefaultServiceItemViewModel(meters.meterTypes, SupplyType.Electricity),
      water: InputEx.getDefaultServiceItemViewModel(meters.meterTypes, SupplyType.Water),
      sewerage: InputEx.getDefaultServiceItemViewModel(meters.meterTypes, SupplyType.Sewerage),
      gas: InputEx.getDefaultServiceItemViewModel(meters.meterTypes, SupplyType.Gas),
      adHoc: InputEx.getDefaultServiceItemViewModel(meters.meterTypes, SupplyType.AdHoc),

      isExpanded: false,
      services: [],
      numberOfChildren: 0
    };

    return service;
  }

  public static getServiceById(serviceId: string, services: ServiceViewModel[]): ServiceViewModel {
    let notFoundResult = null;

    for (var i = 0; i < services.length; i++) {
      let service = services[i];
      if (service.id === serviceId) {
        return service;
      }

      if (service.services.length > 0) {
        service = InputEx.getServiceById(serviceId, service.services);
        if (service) {
          return service;
        }
      }
    }

    return notFoundResult;
  }

  public static updateService(serviceId: string, services: any[], updateFn: (service: any) => any): any[] {
    return services.map(service => {

      if (service.id === serviceId) {
        return updateFn(service);
      }

      if (service.services.length > 0) {
        const result = Object.assign({}, service);
        result.services = InputEx.updateService(serviceId, service.services, updateFn);
        return result;
      }

      return service;
    });
  }

  public static getServicesByFilter(services: ServiceViewModel[], filterFn: (service: ServiceViewModel) => boolean):
    ServiceViewModel[] {
    let result = services.filter(filterFn).map(service => Object.assign({}, service));

    result.forEach(service => {
      if (service.services.length > 0) {
        service.services = InputEx.getServicesByFilter(service.services, filterFn);
      }
    });

    return result;
  }

  public static getFilteredServicesArray(services: ServiceViewModel[],
                                         filterFn: (service: ServiceViewModel) => boolean): ServiceViewModel[] {

    let result = [];
    services.forEach(s => {
      let service = Object.assign({}, s);

      if (filterFn(service)) {
        result.push(service);
      }

      if (service.services.length > 0) {
        let filteredClildServices = InputEx.getFilteredServicesArray(service.services, filterFn);
        if (filteredClildServices.length > 0) {
          result.push(filteredClildServices);
        }
      }
    });

    return result;
  }

  public static getServiceEnumerator<T extends ServiceViewModel>(services: T[], iterationFn: (service: T, path: number) => void) {
    this.invokeIteration(services, 0, iterationFn);
  }

  public static calcNumberOfChildrenForServices<T extends ServiceViewModel>(services: T[]) {
    InputEx.getServiceEnumerator(services,
      (service) => {
        this.calcNumberOfChildrenForService(service);
      });
  }

  public static calcNumberOfChildrenForService<T extends ServiceViewModel>(service: T) {
    let count = 0;

    InputEx.getServiceEnumerator(service.services,
      () => {
        count++;
      });

    let entity = service as ServiceViewModel;
    entity.numberOfChildren = count;
  }

  private static invokeIteration<T extends ServiceViewModel>(services: T[], path: number, iterationFn: (service: T, path: number) => void) {
    let nextLevel = path + 1;
    services.forEach(service => {
      iterationFn(service, path);
      this.invokeIteration(service.services, nextLevel, iterationFn);
    });
  }
}

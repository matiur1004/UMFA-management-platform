import {ServiceItemViewModel} from './service-item.model';
import {ChargingType} from '@models';

export class ServiceViewModel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  chargingType: ChargingType;

  serviceCategoryIsFullMetering: boolean;
  serviceCategoryIsPartialMetering: boolean;
  serviceCategoryIsPrepaidMetering: boolean;
  serviceCategoryIsSingleTenant: boolean;

  electricity: ServiceItemViewModel;
  gas: ServiceItemViewModel;
  water: ServiceItemViewModel;
  sewerage: ServiceItemViewModel;
  adHoc: ServiceItemViewModel;

  services: ServiceViewModel[] = new Array<ServiceViewModel>();
}

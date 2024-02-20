import {ServiceCategoryType} from '@models';

export class ServiceItemViewModel {
  id: string;
  isActive: boolean;
  minimalFee: number;
  fixedPrice: number;
  perBuilding: number | null;
  perCouncilAccount: number | null;
  perHour: number | null;
  perMeter: any[];
  perShop: number;
  perSquareMeter: number;
  perTenant: number;
  serviceCategory: ServiceCategoryType;
}


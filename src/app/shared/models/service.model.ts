import {MeterTypeViewModel} from "./meter-type.model";

export interface ServiceViewModel {
  id: string;
  parentId: string;

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

  isExpanded: boolean;
  services: Array<ServiceViewModel>;
  numberOfChildren: number;
}

export interface ServiceItemViewModel {
  id: string;
  isActive: boolean;
  minimalFee: number;
  fixedPrice: number;
  perBuilding: number | null;
  perCouncilAccount: number | null;
  perHour: number | null;
  perMeter: number;
  perShop: number;
  perSquareMeter: number;
  perTenant: number;
  meterTypes: MeterTypeViewModel[];

  recomFixedPrice: number;
  recomPerBuilding: number | null;
  recomPerCouncilAccount: number | null;
  recomPerHour: number | null;
  recomPerMeter: number;
  recomPerShop: number;
  recomPerSquareMeter: number;
  recomPerTenant: number;

  fixedPriceChanged: boolean;
  perTenantChanged: boolean;
  perShopChanged: boolean;
  perMeterChanged: boolean;
  perSquareMeterChanged: boolean;
  perBuildingChanged: boolean;
  perCouncilAccountChanged: boolean;
  perHourChanged: boolean;
}

export enum ChargingType {
  Regular,
  OneTime
}

export class ServiceCountBuilder {
  public allItemsCount: number = 0;
  public firstLevelCount: number = 0;
  public secondLevelCount: number = 0;
  public thirdLevelCount: number = 0;
  public fourthLevelCount: number = 0;

  public build(): string {

    let result: string = '1st-level services: {0}'.replace(
      '{0}', this.firstLevelCount.toString());
    if (this.firstLevelCount === 0)
      return result;

    if (this.secondLevelCount === 0)
      return result;
    result += ' / 2nd-level: {0}'.replace('{0}', this.secondLevelCount.toString());

    if (this.thirdLevelCount === 0)
      return result;
    result += ' / 3rd-level: {0}'.replace('{0}', this.thirdLevelCount.toString());

    if (this.fourthLevelCount === 0)
      return result;
    result += ' / 4rd-level: {0}'.replace('{0}', this.fourthLevelCount.toString());

    return result;
  }
}

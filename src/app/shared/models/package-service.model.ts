import {ChargingType} from "./service.model";

export interface PackageServiceViewModel {

  id: string;
  parentId: string;

  name: string;
  description: string;
  isActive: boolean;
  chargingType: ChargingType;
  isEnabled: boolean;
  serviceCategoryIsFullMetering: boolean;
  serviceCategoryIsPartialMetering: boolean;
  serviceCategoryIsPrepaidMetering: boolean;
  serviceCategoryIsSingleTenant: boolean;

  adHoc: PackageServiceItemViewModel;
  electricity: PackageServiceItemViewModel;
  gas: PackageServiceItemViewModel;
  sewerage: PackageServiceItemViewModel;
  water: PackageServiceItemViewModel;

  isExpanded: boolean;
  chargingMethod: ChargingMethod;
  unitPrice: number;
  servicePrice: number;
  services: Array<PackageServiceViewModel>;
}

export interface PackageServiceItemViewModel {
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

  recomFixedPrice: number;
  recomPerBuilding: number | null;
  recomPerCouncilAccount: number | null;
  recomPerHour: number | null;
  recomPerMeter: number;
  recomPerShop: number;
  recomPerSquareMeter: number;
  recomPerTenant: number;

  /** default false */
  fixedPriceChanged: boolean;
  /** default false */
  perTenantChanged: boolean;
  /** default false */
  perShopChanged: boolean;
  /** default false */
  perMeterChanged: boolean;
  /** default false */
  perSquareMeterChanged: boolean;
  /** default false */
  perBuildingChanged: boolean;
  /** default false */
  perCouncilAccountChanged: boolean;
  /** default false */
  perHourChanged: boolean;
}

export enum ChargingMethod {
  FixedPrice,
  PerTenant,
  PerShop,
  PerMeter,
  PerSquareMeter,
  PerBuilding,
  PerCouncilAccount,
  PerHour
}

export const getChargingMethodTitle = (chargingMethod: ChargingMethod) => {
  let text = '';

  switch (chargingMethod) {
    case ChargingMethod.FixedPrice:
      text = "fixed price";
      break;

    case ChargingMethod.PerTenant:
      text = "per tenant";
      break;

    case ChargingMethod.PerShop:
      text = "per shop";
      break;

    case ChargingMethod.PerMeter:
      text = "per meter";
      break;

    case ChargingMethod.PerSquareMeter:
      text = "per square meter";
      break;

    case ChargingMethod.PerCouncilAccount:
      text = "per council account";
      break;

    case ChargingMethod.PerHour:
      text = "per hour";
      break;

    case ChargingMethod.PerBuilding:
      text = "per building";
      break;

    default:
      break;
  }

  return text;
}

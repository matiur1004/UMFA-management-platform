import {PackageMeterTypeViewModel} from "./package-meter.model";

export interface SupplierPriceViewModel {
  fixedPrice: number;
  recomPrice: number;
  minimalFee: number;
  perTenant: number;
  perShop: number;
  perMeter: number;
  perSquareMeter: number;
  perBuilding: number | null;
  perCouncilAccount: number | null;
  perHour: number | null;
  meterTypes: PackageMeterTypeViewModel[];

  fixedPriceChanged: boolean;
  perTenantChanged: boolean;
  perShopChanged: boolean;
  perMeterChanged: boolean;
  perSquareMeterChanged: boolean;
  perBuildingChanged: boolean;
  perCouncilAccountChanged: boolean;
  perHourChanged: boolean;
}

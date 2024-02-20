import {PackageChargingMethod} from ".";
import {PackageServiceViewModel, SupplierPriceViewModel} from "@models";

export class BuildingPackageDetailViewModel {
  id: string;
  name: string;

  hasElectricitySupplier: boolean;
  hasWaterSupplier: boolean;
  hasSewerageSupplier: boolean;
  hasGasSupplier: boolean;
  hasAdHocSupplier: boolean;

  hasElectricitySupplierDefault: boolean;
  hasWaterSupplierDefault: boolean;
  hasSewerageSupplierDefault: boolean;
  hasGasSupplierDefault: boolean;
  hasAdHocSupplierDefault: boolean;

  perTenant: number;
  perShop: number;
  perMeter: number;
  perSquareMeter: number;
  perBuilding: number;
  perCouncilAccount: number;
  perHour: number;
  fixedPrice: number;

  numberOfTenants: number;
  numberOfShops: number;
  numberOfSqMetres: number;
  numberOfCouncilAcc: number;
  numberOfHours: number;
  numberOfMeters: number;

  meterTypes: any[];

  electricitySupplierPrice: SupplierPriceViewModel;
  waterSupplierPrice: SupplierPriceViewModel;
  gasSupplierPrice: SupplierPriceViewModel;
  sewerageSupplierPrice: SupplierPriceViewModel;
  adHocSupplierPrice: SupplierPriceViewModel;

  hasFixedPriceMethod: boolean;
  hasPerTenantMethod: boolean;
  hasPerShopMethod: boolean;
  hasPerMeterMethod: boolean;
  hasPerSQMeterMethod: boolean;
  hasPerBuildingMethod: boolean;
  hasPerCouncilAccountMethod: boolean;
  hasPerHourMethod: boolean;
  hasCustomMethod: boolean;

  chargingMethod: PackageChargingMethod;
  services: PackageServiceViewModel[];
}

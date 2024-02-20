import {SupplierPriceViewModel} from "./supplier-price.model";
import {PackageServiceViewModel} from "./package-service.model";


export interface PackageDetailVewModel {
  id: string;
  name: string;
  isActive: boolean;
  regNumber: string;
  color: string;

  hasElectricitySupplier: boolean;
  hasWaterSupplier: boolean;
  hasGasSupplier: boolean;
  hasSewerageSupplier: boolean;
  hasAdHocSupplier: boolean;

  electricitySupplierPrice: SupplierPriceViewModel;
  waterSupplier: SupplierPriceViewModel;
  gasSupplier: SupplierPriceViewModel;
  sewerageSupplier: SupplierPriceViewModel;
  adHocSupplier: SupplierPriceViewModel;

  services: PackageServiceViewModel[];
}

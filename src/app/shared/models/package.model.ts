export interface PackageViewModel {
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

  perTenant: number;
  perShop: number;
  perMeter: number;
  perSquareMeter: number;

  serviceCount: number;
  appliedCount: number;
  modifyDate: Date;
  createDate: Date;
}

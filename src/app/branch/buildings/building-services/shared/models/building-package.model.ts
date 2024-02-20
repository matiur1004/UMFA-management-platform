export class BuildingPackageViewModel {
  id: string;
  name: string;
  serviceCount: number;
  hasElectricitySupplier: boolean;
  hasWaterSupplier: boolean;
  hasSewerageSupplier: boolean;
  hasGasSupplier: boolean;
  hasAdHocSupplier: boolean;

  packageCategoryIsFullMetering: boolean;
  packageCategoryIsPartialMetering: boolean;
  packageCategoryIsPrepaidMetering: boolean;
  packageCategoryIsSingleTenant: boolean;
}

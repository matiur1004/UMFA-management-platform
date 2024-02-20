export enum TenantCostCalculationMode {
  default,
  withEmpty,
  withAproximated
}

export interface ConfirmationReport {
  calculationMode: TenantCostCalculationMode;
}

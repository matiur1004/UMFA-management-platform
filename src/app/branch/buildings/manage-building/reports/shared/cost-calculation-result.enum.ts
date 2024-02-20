export enum CalculationCostResult {
  Calculated,
  NewTariffVersionsShouldBeApplied,
  NewTariffVersionsAreAppliedWithoutConflicts,
  NewTariffVersionsAreAppliedWithConflicts,
  Conflicts
}

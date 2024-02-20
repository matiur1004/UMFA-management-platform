export enum NodeTariffsPopupMode {
  NewTariffVersionsInfo,
  NewTariffVersionsWithoutChoice,
  NewTariffVersionsWithChoice,
  Conflicts
}

export enum NodeTariffsPopupResult {
  ApplyNewTariffVersions,
  KeepExistingTariffVersions,
  ResolveConflicts
}

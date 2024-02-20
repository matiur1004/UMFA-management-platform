import {AllocatedTariffsEffects} from './allocated-tariffs.effects';
import {AddNewSupplierBranchEffects} from './add-new-tariff-building.effects';
import {AdditionalChargesEffects} from './additional-charges.effects';
import {EditChargeVersionEffects} from './edit-charge-version.effects';
import {EditChargeValueEffects} from './edit-charge-value.effects';
import {BuildingTariffSettingsEffects} from './tariff-settings.effects';
import {BuildingTariffValuesEffects} from './tariff-values.effects';
import {CreateTariffEffects} from './create-tariff.effects';
import {TariffDetailsEffects} from './tariff.effects';
import {TariffListEffects} from './tariff-list.effects';
import {BuildingCreateTariffValueEffects} from './create-tariff-values.effects';
import {CostProviderNodesEffects} from './cost-provider-nodes.effects';
import {TariffVersionSettingsEffects} from "./tariff-version-settings.effects";

export const effects: any[] = [
  AllocatedTariffsEffects,
  AddNewSupplierBranchEffects,
  AdditionalChargesEffects,
  EditChargeVersionEffects,
  EditChargeValueEffects,
  BuildingTariffSettingsEffects,
  CreateTariffEffects,
  TariffVersionSettingsEffects,
  TariffDetailsEffects,
  CostProviderNodesEffects,
  TariffListEffects,
  BuildingTariffValuesEffects,
  BuildingCreateTariffValueEffects
];

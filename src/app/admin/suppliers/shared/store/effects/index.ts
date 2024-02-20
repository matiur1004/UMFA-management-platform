import {SupplierEffects} from './supplier.effects';
import {TariffEffects} from './tariff.effects';
import {TariffValuesEffects} from './tariff-values.effects';
import {SupplierTariffCategoriesEffects} from './supplier-tariff-settings.effects';
import {TariffVersionSettingsEffects} from "./tariff-version-settings.effects";

export const effects: any[] = [
  SupplierEffects,
  TariffEffects,
  TariffValuesEffects,
  SupplierTariffCategoriesEffects,
  TariffVersionSettingsEffects
];

export * from './supplier.effects';
export * from './tariff.effects';
export * from './tariff-values.effects';
export * from './supplier-tariff-settings.effects';
export * from './tariff-version-settings.effects';

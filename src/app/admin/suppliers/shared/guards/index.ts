import {TariffValuesGuard} from './tariff-values.guard';
import {LoadRegistersGuard} from './load-registers.guard';
import {TariffSettingsGuard} from './tariff-settings.guard';
import {LoadAttributesGuard} from './load-attributes.guard';
import {SupplierGuard} from './supplier.guard';
import {BuildingCategoriesGuard} from './building-categories.guard';
import {TariffDetailsGuard} from './tariff-details.guard';
import {TariffVersionSettingsGuard} from "./tariff-version-settings.guard";

export const guards: any[] = [
  BuildingCategoriesGuard,
  TariffValuesGuard,
  LoadRegistersGuard,
  LoadAttributesGuard,
  TariffSettingsGuard,
  SupplierGuard,
  TariffDetailsGuard,
  TariffVersionSettingsGuard
];

export * from './tariff-values.guard';
export * from './load-attributes.guard';
export * from './load-registers.guard';
export * from './tariff-settings.guard';
export * from './supplier.guard';
export * from './building-categories.guard';
export * from './tariff-details.guard';
export * from './tariff-version-settings.guard';


import {box, Boxed} from 'ngrx-forms';
import {TariffCategoryViewModel} from './tariff-category.model';
import {TariffStepModel} from './tariff-step.model';

export class BaseLineItemViewModel {
  id: string;
  name: string;
  chargingType: TariffLineItemChargingType;
  chargingMethod = 'R/';
  categories: Boxed<TariffCategoryViewModel[]> = box([]);
  controlPosition = 0;
}

export class BasedOnReadingsLineItemViewModel extends BaseLineItemViewModel {
  unitOfMeasurement: number;
  hasSeasonalChanges: boolean;
  hasTou: boolean;
  stepSchema: TariffStepModel;
  hasDuplicationFactor: boolean;
  costProviderId?: string;
}

export class BasedOnReadingsAndSettingsLineItemViewModel extends BaseLineItemViewModel {
  basicPeriod: number | null;
  hasSeasonalChanges: boolean;
}

export class BasedOnAttributesLineItemViewModel extends BaseLineItemViewModel {
  basicPeriod: number;
  attributeId: string;
  hasSeasonalChanges: boolean;
}

export class BasedOnCalculationsLineItemViewModel extends BaseLineItemViewModel {
  dependentLineItemIds: Boxed<string[]> = box([]);
}

export class FixedPriceLineItemViewModel extends BaseLineItemViewModel {
  basicPeriod: number;
  hasSeasonalChanges: boolean;
  hasDuplicationFactor: boolean;
}

export enum TariffLineItemChargingType {
  BasedOnReadings,
  BasedOnReadingsAndSettings,
  FixedPrice,
  BasedOnAttributes,
  BasedOnCalculations
}

export enum BasicPeriod {
  Custom = 0,
  Month = 1,
  Day = 2
}

export const chargingTypes = [
  TariffLineItemChargingType.FixedPrice,
  TariffLineItemChargingType.BasedOnReadingsAndSettings,
  TariffLineItemChargingType.BasedOnReadings,
  TariffLineItemChargingType.BasedOnCalculations,
  TariffLineItemChargingType.BasedOnAttributes
];

export const chargingTypeText = {
  [TariffLineItemChargingType.BasedOnAttributes]: 'Based on attributes',
  [TariffLineItemChargingType.BasedOnCalculations]: '% based on monetary value',
  [TariffLineItemChargingType.BasedOnReadings]: 'Based on readings',
  [TariffLineItemChargingType.BasedOnReadingsAndSettings]: 'Based on readings and settings',
  [TariffLineItemChargingType.FixedPrice]: 'Fixed price'
};

export const nonElectricityChargingTypes = [
  TariffLineItemChargingType.FixedPrice,
  TariffLineItemChargingType.BasedOnReadings,
  TariffLineItemChargingType.BasedOnCalculations,
];

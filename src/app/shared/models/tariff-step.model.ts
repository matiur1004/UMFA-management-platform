import {StringExtension} from '../helper/string-extension';

export enum TariffStepType {
  Day,
  DayWithMonthRanges,
  Month
}

export const TariffStepApplyPerTypeTextList = {
  [TariffStepType.Day]: 'Daily',
  [TariffStepType.DayWithMonthRanges]: 'Daily Custom Calculation',
  [TariffStepType.Month]: 'Monthly',
};

export interface Range<T> {
  from: T;
  to: T;
}

export class TariffStepRangeModel implements Range<number> {
  id: string;
  suppliersTariffStepId: string;
  from: number;
  to: number;

  constructor(stepId: string) {
    this.id = StringExtension.NewGuid();
    this.suppliersTariffStepId = stepId;
    this.from = null;
    this.to = null;
  }
}

export abstract class TariffStepModelBase {
  id: string = StringExtension.NewGuid();
  name: string = null;
  applyPer: TariffStepType = TariffStepType.Month;
  unitOfMeasurement: number = null;
  ranges: TariffStepRangeModel[] = [new TariffStepRangeModel(this.id)];

  withNegativeRanges = false;
}

export class TariffStepModel extends TariffStepModelBase {
  supplierId: string = null;
  buildingId: string = null;
}

export class TariffVersionStepModel extends TariffStepModelBase {
}

export enum InfinityRange {
  MIN = -2147483648,
  MAX = 2147483647
}

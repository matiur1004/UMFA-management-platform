import {ApplyEstimatedOptionTypeEnum} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models/apply-estimated.model';

export interface MeterRegisterBaseEstimateViewModel {
  durationDays: number;
  readingValue: number;
  dailyUsage: number;
  estimatedUsage: number;
  estimatedReading: number;
}

export interface MeterRegisterDailyEstimateViewModel extends MeterRegisterBaseEstimateViewModel {
  readingDate: string | Date;
  previousReadingValue: number;
  periodDurationDays: number;
  usage: number;
  optionId?: string;
}

export interface MeterRegisterMonthlyBasedEstimateViewModel extends MeterRegisterBaseEstimateViewModel {
  periodsNumber: number;
  openingReading: number;
  optionId: ApplyEstimatedOptionTypeEnum;
  usage: number;
  periods: PeriodSummary[];
}

export interface MeterRegisterYearBasedEstimateViewModel extends MeterRegisterBaseEstimateViewModel {
  yearsNumber: number;
  averageUsage: number;
  optionId?: ApplyEstimatedOptionTypeEnum;
}

export class PeriodSummary {
  periodId: string;
  periodName: string;
  lastReadingDate: Date;
  readingValue: number;
  days: number;
  usage: number;
}
